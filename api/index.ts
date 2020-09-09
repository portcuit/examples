import {merge} from "rxjs";
import {directProc, entry, mapToProc, mergeMapProc, mount, sink, source, terminatedComplete} from "pkit";
import {httpServerApiKit, HttpServerApiPort, RequestArgs, route} from "pkit/http/server";

import {server as createServer} from '../src/app/html-pretty-print/ui/'
import {map} from "rxjs/operators";

export default (...requestArgs: RequestArgs) =>
  entry(new HttpServerApiPort, (port) =>
    merge(
      httpServerApiKit(port),
      merge(
        mount(createServer(requestArgs)))
        .pipe(map((data) =>
          sink(port.info)(data))),
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')
    ), requestArgs)
