import {merge} from "rxjs";
import {directProc, entry, mapToProc, mergeMapProc, sink, source, terminatedComplete} from "pkit";
import {HttpServerApiPort, RequestArgs, route} from "pkit/http/server";
import  * as todo from '../src/app/todo/ssr'

export default (...args: RequestArgs) =>
  terminatedComplete(entry(new HttpServerApiPort, (port) =>
    merge(
      todo.apiKit(port),
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')
    ), args))
