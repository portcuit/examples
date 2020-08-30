import handler, {Config} from 'serve-handler'
import {merge} from "rxjs";
import {
  LifecyclePort,
  sink,
  source,
  entry,
  terminatedComplete,
  latestMergeMapProc,
  mapProc,
  mapToProc,
  mergeMapProc
} from "pkit";
import {
  get,
  httpServerApiKit,
  HttpServerApiPort, httpServerApiTerminateKit,
  httpServerKit,
  HttpServerParams,
  HttpServerPort,
  route,
  SseServerPort,
} from "pkit/http/server";
import {App} from './app'

export type Params = {
  http: HttpServerParams,
  serveConfig: Config;
}

export const params: Params = {
  http:{
    listen: [10080]
  },
  serveConfig: {
    public:'./',
    cleanUrls: false,
    headers: [{
      source: "*",
      headers: [{
        key: 'Cache-Control',
        value: 'no-cache, no-store, must-revalidate'
      }]
    }]
  }
}

export class Port extends LifecyclePort<Params> {
  http = new  HttpServerPort;
}

export const circuit = (port: Port) =>
  merge(
    httpServerKit(port.http),
    useApiKit(port),
    staticKit(port),
    lifecycleKit(port)
  )

const lifecycleKit = (port: Port) =>
  merge(
    mapProc(source(port.init), sink(port.http.init), ({http}) => http),
    mapToProc(source(port.http.ready), sink(port.http.running), true)
  )

const staticKit = (port: Port) =>
  latestMergeMapProc(route('**', source(port.http.event.request)), sink(port.http.debug), [source(port.init)],
    async ([[req, res], {serveConfig}]) => {
      // if (req.url!.startsWith('/node_modules/') && req.url!.match(/\/[^.]+$/)) {
      //   req.url = `${req.url}.js`;
      // }
      return {handler: await handler(req, res, serveConfig)}
    })

const useApiKit = (port: Port) =>
  mergeMapProc(source(port.http.event.request), sink(port.debug), (data) =>
    terminatedComplete(entry(new ApiPort, apiKit, data))
  )

class ApiPort extends HttpServerApiPort {}

const apiKit = (port: ApiPort) =>
  merge(
    httpServerApiKit(port),
    routeKit(port),
    httpServerApiTerminateKit(port)
  )

const routeKit = (port: ApiPort) =>
  merge(
    mapProc(get('/', source(port.init)), sink(port.json), () => ({
      msg: 'Hello World'
    })),
    mapProc(get('/hello.html', source(port.init)), sink(port.html), () =>
      `<p>hello</p>`),

    mapProc(get('/**/*.html', source(port.init)), sink(port.vnode),
      ([req]) => App({src: req.url!.replace('.html', '.js')}))
  )
