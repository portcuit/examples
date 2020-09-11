import {merge} from "rxjs";
import {map} from "rxjs/operators";
import {entry, mapToProc, mount, sink, source} from "pkit";
import {httpServerApiKit, HttpServerApiPort, RequestArgs, route} from "pkit/http/server";
import {createSsr as app1} from '../src/app/html-pretty-print/ui/'
import {createSsr as app2} from '../src/app/worker-todomvc/ui/'

export default (...requestArgs: RequestArgs) =>
  entry(new HttpServerApiPort, (port) =>
    merge(httpServerApiKit(port),
      merge(
        mount(app1(requestArgs)),
        mount(app2(requestArgs))
      ).pipe(map((data) => sink(port.info)(data))),
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')), requestArgs)
