import handler, {Config} from 'serve-handler'
import {merge} from "rxjs";
import {
  LifecyclePort,
  sink,
  source,
  entry,
  terminatedComplete,
  directProc,
  latestMergeMapProc,
  mapProc,
  mapToProc,
  mergeMapProc
} from "pkit";
import {
  httpServerKit,
  HttpServerParams,
  HttpServerPort,
  route, sseServerKit,
  SseServerPort, sseServerRemoteKit
} from "@pkit/http";
import * as api from './api'

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
  http = new class extends HttpServerPort {
    sse = new SseServerPort;
  }
}

export const circuit = (port: Port) =>
  merge(
    httpServerKit(port.http),
    sendSseKit(port),
    apiKit(port),
    staticKit(port),
    lifecycleKit(port)
  )

const lifecycleKit = (port: Port) =>
  merge(
    mapProc(source(port.init), sink(port.http.init), ({http}) => http),
    mapToProc(source(port.http.ready), sink(port.http.running), true)
  )

const apiKit = (port: Port) =>
  mergeMapProc(source(port.http.event.request), sink(port.debug), (data) =>
    terminatedComplete(entry(new api.Port, api.circuit, data)))

const staticKit = (port: Port) =>
  latestMergeMapProc(route('**', source(port.http.event.request)), sink(port.http.debug), [source(port.init)],
    async ([[req, res], {serveConfig}]) => {
      if (req.url!.startsWith('/node_modules/') && req.url!.match(/\/[^.]+$/)) {
        req.url = `${req.url}.js`;
      }
      return {handler: await handler(req, res, serveConfig)}
    })

const sendSseKit = (port: Port) =>
  mergeMapProc(route('/sse', source(port.http.event.request), 'GET'), sink(port.debug), (data) => {
    const ssePort = new SseServerPort
    return terminatedComplete (entry(ssePort, (sseServerPort: SseServerPort) =>
      merge(
        sseServerKit(sseServerPort),
        sseServerRemoteKit(sseServerPort, [
          port.info
        ]),
        directProc(source(port.http.sse.terminate), sink(ssePort.terminate)),
      ), {args: data, retry: 3000}));
  })
