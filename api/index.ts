import {merge} from "rxjs";
import {directProc, entry, mapToProc, mergeMapProc, mount, sink, source, terminatedComplete} from "pkit";
import {HttpServerApiPort, RequestArgs, route} from "pkit/http/server";

import {server as createServer} from '../src/app/html-pretty-print/ui/'

export default (...requestArgs: RequestArgs) =>
  terminatedComplete(entry(new HttpServerApiPort, (port) =>
    merge(
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')
    ), requestArgs))
