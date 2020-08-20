import {fromEvent, merge, of} from "rxjs";
import {map, startWith, switchMap} from "rxjs/operators";
import {LifecyclePort, source, sink, Socket} from "pkit/core";
import {
  directProc,
  fromEventProc,
  latestMapProc,
  latestMergeMapProc,
  mapProc,
  mapToProc,
  mergeMapProc
} from "pkit/processors";
import {workerKit, WorkerParams, WorkerPort, parentRemoteWorkerKit} from "pkit/worker";
import {
  snabbdomKit,
  SnabbdomParams,
  SnabbdomPort,
  defaultModules,
  createActionModule,
  ActionDetail
} from "@pkit/snabbdom";
import {Port as AppPort, initial} from "../app/"

export type Params = {
  worker: WorkerParams,
  snabbdom: SnabbdomParams,
  window: Window,
  target: EventTarget
}

export class Port extends LifecyclePort<Params> {
  app = new class extends WorkerPort {
    ifs = new AppPort;
  };
  snabbdom = new SnabbdomPort;
  state = new Socket<any>();
}

export const circuit = (port: Port) =>
  merge(
    useServiceKit(port),
    useSnabbdomKit(port),
    lifecycleKit(port)
  )

const lifecycleKit = (port: Port) =>
  merge(
    directProc(source(port.app.ifs.state.raw), sink(port.state)),
    latestMapProc(source(port.app.ifs.ready), sink(port.app.ifs.state.init), [source(port.state)],
      ([,state]) => state),
    directProc(of(initial), sink(port.state)),
  )

const useServiceKit = (port: Port) =>
  merge(
    workerKit(port.app),
    parentRemoteWorkerKit(port.app, [
      port.app.ifs.state.init,
      port.app.ifs.action,
      port.app.ifs.dom.event.hashchange
    ], port.app.ifs),
    mapProc(source(port.init), sink(port.app.init),
      ({worker}) => worker),
    mapToProc(source(port.app.ready), sink(port.app.running), true)
  )

const useSnabbdomKit = (port: Port) =>
  merge(
    snabbdomKit(port.snabbdom),
    mapProc(source(port.init), sink(port.snabbdom.init), ({snabbdom, target}) =>
      ({...snabbdom,
        modules: [createActionModule(target), ...defaultModules]
      })),
    mergeMapProc(source(port.init), sink(port.app.ifs.action), ({target}) =>
      fromEvent<CustomEvent<ActionDetail>>(target as any, 'action').pipe(
        map(({detail}) =>
          detail))),
    mergeMapProc(source(port.init), sink(port.app.ifs.dom.event.hashchange), ({window}) =>
      fromEvent<void>(window, 'hashchange').pipe(
        map(() =>
          window.location.hash))),
    directProc(source(port.app.ifs.vnode), sink(port.snabbdom.render)),
  )