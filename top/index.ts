import {fromEvent, merge, of} from "rxjs";
import {map, startWith, switchMap} from "rxjs/operators";
import {LifecyclePort, source, sink, Socket} from "pkit/core";
import {directProc, latestMapProc, mapProc, mapToProc} from "pkit/processors";
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
  snabbdom: SnabbdomParams
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
      port.app.ifs.action
    ], port.app.ifs),
    mapProc(source(port.init), sink(port.app.init),
      ({worker}) => worker),
    mapToProc(source(port.app.ready), sink(port.app.running), true)
  )

const useSnabbdomKit = (port: Port) =>
  merge(
    snabbdomKit(port.snabbdom),
    source(port.init).pipe(
      switchMap(({snabbdom}) => {
        const target = new EventTarget;
        return fromEvent<CustomEvent<ActionDetail>>(target as any, 'action').pipe(
          map(({detail}) =>
            sink(port.app.ifs.action)(detail)),
          startWith(sink(port.snabbdom.init)({...snabbdom,
            modules: [createActionModule(target), ...defaultModules]
          })))
      })),
    directProc(source(port.app.ifs.vnode), sink(port.snabbdom.render)),
  )