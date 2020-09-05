import handler from 'serve-handler'
import {merge} from "rxjs";
import {
  sink,
  source,
  entry,
  terminatedComplete,
  mapToProc,
  mergeMapProc,
  RootCircuit
} from "pkit";
import {
  HttpServerApiPort,
  httpServerKit,
  HttpServerPort,
  route
} from "pkit/http/server";

export const createDevKit = (apiKit: RootCircuit<HttpServerApiPort>) =>
  (port: HttpServerPort) =>
    merge(
      httpServerKit(port),
      mergeMapProc(source(port.event.request), sink(port.debug), (data) =>
        terminatedComplete(entry(new HttpServerApiPort, apiKit, data))),
      mergeMapProc(route('**', source(port.event.request)), sink(port.debug), async ([req, res]) =>
        ({handler: await handler(req, res, {public: './public', cleanUrls: false})})),
      mapToProc(source(port.ready), sink(port.running), true)
    )
