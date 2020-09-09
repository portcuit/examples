import {merge} from "rxjs";
import {directProc, entry, mapToProc, mergeMapProc, mount, sink, source, terminatedComplete} from "pkit";
import {HttpServerApiPort, RequestArgs, route} from "pkit/http/server";

import * as todo from '../src/app/worker-todomvc/server/'
import * as httpPrettyPrint from '../src/app/html-pretty-print/server/'

import {server as createServer} from '../src/app/html-pretty-print/ui/'

export default (...requestArgs: RequestArgs) =>
  terminatedComplete(entry(new HttpServerApiPort, (port) =>
    merge(
      mount(createServer(requestArgs)),
      mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')
    ), requestArgs))

  // merge(
  //   mount(createServer(requestArgs))
  // ).subscribe()

  // terminatedComplete(entry(new HttpServerApiPort, (port) =>
  //   merge(
  //
  //     mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')
  //   ), requestArgs))

  // mount(createServer(requestArgs))



// export default (...args: RequestArgs) =>
//   terminatedComplete(entry(new HttpServerApiPort, (port) =>
//     merge(
//       // todo.apiKit(port),
//       // httpPrettyPrint.circuit(port as any),
//       mapToProc(route('**', source(port.init)), sink(port.notFound.html), '404 Not Found.')
//     ), args))
