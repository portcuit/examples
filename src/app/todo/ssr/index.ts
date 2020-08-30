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

export const params: HttpServerParams = {
    listen: [10080]
}

export class Port extends HttpServerPort {}

export const circuit = (port: Port) =>
  merge(
    httpServerKit(port),
    mergeMapProc(source(port.event.request), sink(port.debug), (data) =>
      terminatedComplete(entry(new HttpServerApiPort, apiKit, data))),
    mergeMapProc(route('**', source(port.event.request)), sink(port.debug),
      async ([req, res]) =>
        ({handler: await handler(req, res, {public: './', cleanUrls: false})})),
    mapToProc(source(port.ready), sink(port.running), true)
  )

const apiKit = (port: HttpServerApiPort) =>
  merge(
    httpServerApiKit(port),
    mapProc(get('/', source(port.init)), sink(port.vnode),
      ([req]) => App({src: '/esm/app/todo/top/main.js'})),
    httpServerApiTerminateKit(port)
  )

export default [Port, circuit, params]