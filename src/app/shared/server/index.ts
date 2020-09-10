import {promisify} from 'util'
import {resolve} from 'path'
import glob from 'glob'
import handler from "serve-handler";
import {from, merge, of} from "rxjs";
import {sink, source, mergeMapProc, entry, terminatedComplete, mapToProc, mount, LifecyclePort, mapProc} from "pkit";
import {HttpServerPort, httpServerKit, route, HttpServerParams} from "pkit/http/server";
import {delay, map, mergeMap, switchMap} from "rxjs/operators";

export type Params = {
  server: HttpServerParams;
  ui: string;
}

export class Port extends LifecyclePort<Params> {
  server = new HttpServerPort;
}

export const circuit = (port: Port) =>
  merge(
    httpServerKit(port.server),
    source(port.init).pipe(
      switchMap(({ui}) =>
        from(promisify(glob)(`${ui}/**/[!_]*.tsx`)).pipe(
          map((files) =>
            files
              .map((file) =>
                require(resolve(file.slice(0,-4))))
              .filter((page) =>
                !!page.ssr && typeof page.ssr === 'function')),
          switchMap((pages) =>
            mergeMapProc(source(port.server.event.request), sink(port.debug), (requestArgs) =>
              merge(...pages.map(({ssr}) =>
                terminatedComplete(mount(ssr(requestArgs)))))))))),
    mergeMapProc(route('**', source(port.server.event.request).pipe(delay(0))), sink(port.server.debug), async ([req, res]) => {
      if (!['src', 'node_modules'].includes(req.url!.split('/')[1])) {
        req.url = '/public' + req.url
      }
      return ({handler: await handler(req, res, {public: '.', cleanUrls: false})})
    }),
    mapToProc(source(port.server.ready), sink(port.server.running), true),
    mapProc(source(port.init), sink(port.server.init), ({server}) => server),
  )

export default {Port, circuit}