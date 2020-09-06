import {merge} from "rxjs";
import {directProc, entry, mapToProc, mergeMapProc, sink, source, terminatedComplete} from "pkit";
import {HttpServerApiPort, RequestArgs, route} from "pkit/http/server";
import * as todo from '../src/app/worker-todomvc/server/'
import * as httpPrettyPrint from '../src/app/html-pretty-print/server/'

export default (...args: RequestArgs) =>
  terminatedComplete(entry(new HttpServerApiPort, (port) =>
    merge(
      todo.apiKit(port),
      httpPrettyPrint.circuit(port as any),
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')
    ), args))
