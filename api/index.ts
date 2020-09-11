import glob from 'glob'
import {resolve} from 'path'
import {merge} from "rxjs";
import {map} from "rxjs/operators";
import {entry, mapToProc, mount, sink, source} from "pkit";
import {httpServerApiKit, HttpServerApiPort, RequestArgs, route} from "pkit/http/server";

// import {createSsr as createServer} from '../src/app/html-pretty-print/ui/'
// import {createSsr as todo} from '../src/app/worker-todomvc/ui/'
// import {create} from "domain";

const createSsrs = glob.sync(`${__dirname}/../src/app/**/*.tsx`)
  .map((file) =>
    require(resolve(file).slice(0,-4)))
  .filter(({createSsr}) =>
    !!createSsr && typeof createSsr === 'function')
  .map(({createSsr}) =>
    createSsr)

export default (...requestArgs: RequestArgs) =>
  entry(new HttpServerApiPort, (port) =>
    merge(httpServerApiKit(port),
      merge(
        ...createSsrs.map((createSsr) =>
          mount(createSsr(requestArgs)))

        // mount(createServer(requestArgs)),
        // mount(todo(requestArgs))
      ).pipe(map((data) => sink(port.info)(data))),
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')), requestArgs)
