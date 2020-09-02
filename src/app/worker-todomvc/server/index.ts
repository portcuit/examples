import handler from 'serve-handler'
import {merge} from "rxjs";
import {
  sink,
  source,
  entry,
  terminatedComplete,
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
  route
} from "pkit/http/server";
import {initial} from '../shared/state'
import {Ssr} from '../ui/'

const params: HttpServerParams = {
  listen: [10080]
}

class Port extends HttpServerPort {}

const circuit = (port: Port) =>
  merge(
    httpServerKit(port),
    mergeMapProc(source(port.event.request), sink(port.debug), (data) =>
      terminatedComplete(entry(new HttpServerApiPort, apiKit, data))),
    mergeMapProc(route('**', source(port.event.request)), sink(port.debug),
      async ([req, res]) =>
        ({handler: await handler(req, res, {public: './src/app', cleanUrls: false})})),
    mapToProc(source(port.ready), sink(port.running), true)
  )

export const apiKit = (port: HttpServerApiPort) =>
  merge(
    httpServerApiKit(port),
    mapProc(get('/worker-todomvc/ui/index.html', source(port.init)), sink(port.vnode), ([req]) =>
      Ssr({src: '/esm/app/worker-todomvc/client/top/main.js', state: initial})),
    httpServerApiTerminateKit(port)
  )

export default {Port, circuit, params}