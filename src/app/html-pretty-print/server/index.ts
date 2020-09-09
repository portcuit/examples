import handler from "serve-handler";
import {merge} from "rxjs";
import {sink, source, mergeMapProc, entry, terminatedComplete, mapToProc, mount} from "pkit";
import {HttpServerPort, httpServerKit, route} from "pkit/http/server";
import * as app from '../ui/'

export const circuit = (port: HttpServerPort) =>
  merge(
    mergeMapProc(source(port.event.request), sink(port.debug), (requestArgs) =>
      terminatedComplete(mount(app.server(requestArgs)))),
    httpServerKit(port),
    mergeMapProc(route('**', source(port.event.request)), sink(port.debug), async ([req, res]) =>
      ({handler: await handler(req, res, {public: 'public', cleanUrls: false})})),
    mapToProc(source(port.ready), sink(port.running), true),
  )

export default {Port: HttpServerPort, circuit, params: {listen: [8080]}}