import handler from "serve-handler";
import {merge} from "rxjs";
import {
  sink,
  source,
  mergeMapProc,
  entry,
  terminatedComplete, mapToProc
} from "pkit";
import {HttpServerPort, httpServerKit, route} from "pkit/http/server";
import * as app from '../ui/'

export const circuit = (port: HttpServerPort) =>
  merge(
    httpServerKit(port),
    mergeMapProc(source(port.event.request), sink(port.debug), (requestArgs) =>
      terminatedComplete(entry(new app.server.Port, app.server.circuit, {requestArgs, ...app.server.params}))),
    mergeMapProc(route('**', source(port.event.request)), sink(port.debug), async ([req, res]) =>
      ({handler: await handler(req, res, {public: './public', cleanUrls: false})})),
    mapToProc(source(port.ready), sink(port.running), true)
  )

export default {Port: HttpServerPort, circuit, params: {listen: [8080]}}