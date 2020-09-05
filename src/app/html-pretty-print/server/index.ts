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
import {initialState} from '../shared/state'
import {Ssr} from '../ui/'

const params: HttpServerParams = {
  listen: [8080]
}

const circuit = (port: HttpServerPort) =>
  merge(
    httpServerKit(port),
    mergeMapProc(source(port.event.request), sink(port.debug), (data) =>
      terminatedComplete(entry(new HttpServerApiPort, apiKit, data))),
    mergeMapProc(route('**', source(port.event.request)), sink(port.debug),
      async ([req, res]) => {

        // if (['vendor'].includes(req.url!.split('/')[1])) {
        //   req.url = '/src' + req.url
        // } else if( !['src', 'node_modules'].includes(req.url!.split('/')[1]) ) {
        //   req.url = '/src/app/ui' + req.url
        // }

        return ({handler: await handler(req, res, {public: './public', cleanUrls: false})})
      }),
    mapToProc(source(port.ready), sink(port.running), true)
  )

export const apiKit = (port: HttpServerApiPort) =>
  merge(
    httpServerApiKit(port),
    mapProc(get('/html-pretty-print/index.html', source(port.init)), sink(port.vnode), ([req]) =>
      Ssr(initialState())),
    httpServerApiTerminateKit(port)
  )

export default {Port: HttpServerPort, circuit, params}