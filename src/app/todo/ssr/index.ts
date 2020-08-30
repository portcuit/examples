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
import {App} from './app'

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
        ({handler: await handler(req, res, {public: './', cleanUrls: false})})),
    mapToProc(source(port.ready), sink(port.running), true)
  )

export const apiKit = (port: HttpServerApiPort) =>
  merge(
    httpServerApiKit(port),
    mapProc(get('/src/app/todo', source(port.init)), sink(port.vnode),
      ([req]) => App({src: '/esm/app/todo/top/main.js'})),
    httpServerApiTerminateKit(port)
  )

export default [Port, circuit, params]