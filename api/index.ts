import {merge} from "rxjs";
import {map} from "rxjs/operators";
import {entry, mapToProc, mergeMapProc, mount, sink, source} from "pkit";
import {httpServerApiKit, HttpServerApiPort, RequestArgs, route} from "pkit/http/server";

import {ssr as createServer} from '../src/app/html-pretty-print/ui/'
import {ssr as todo} from '../src/app/worker-todomvc/ui/'

export default (...requestArgs: RequestArgs) =>
  entry(new HttpServerApiPort, (port) =>
    merge(httpServerApiKit(port),
      merge(
        mount(createServer(requestArgs)),
        mount(todo(requestArgs))
      ).pipe(map((data) => sink(port.info)(data))),
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')), requestArgs)
