import {fromEvent, merge} from "rxjs";
import {LifecyclePort, source, sink, Socket} from "pkit/core";
import {directProc, fromEventProc, latestMapProc, mapProc, mapToProc} from "pkit/processors";
import {workerKit, WorkerParams, WorkerPort, parentRemoteWorkerKit} from "pkit/worker";
import {Port as ServicePort} from "../service/"
import {
  snabbdomKit,
  SnabbdomParams,
  SnabbdomPort,
  defaultModules,
  createActionModule,
  ActionDetail
} from "@pkit/snabbdom";
import {map, startWith, switchMap, withLatestFrom} from "rxjs/operators";

export type Params = {
  worker: WorkerParams,
  snabbdom: SnabbdomParams
}

export class Port extends LifecyclePort<Params> {
  service = new class extends WorkerPort {
    ifs = new ServicePort;
  };
  snabbdom = new SnabbdomPort;
  state = new Socket<any>();
}

export const circuit = (port: Port) =>
  merge(
    useServiceKit(port),
    useSnabbdomKit(port),
    directProc(source(port.service.ifs.state.raw), sink(port.state)),

    source(port.service.run.restart).pipe(
      withLatestFrom(source(port.state)),
      switchMap(([,state]) =>
        mapToProc(source(port.service.ifs.ready), sink(port.service.ifs.state.init), state))),
  )

const useServiceKit = (port: Port) =>
  merge(
    workerKit(port.service),
    parentRemoteWorkerKit(port.service, [
      port.service.ifs.state.init,
      port.service.ifs.action
    ], port.service.ifs),
    mapProc(source(port.init), sink(port.service.init),
      ({worker}) => worker),
    mapToProc(source(port.service.ready), sink(port.service.running), true)
  )

const useSnabbdomKit = (port: Port) =>
  merge(
    snabbdomKit(port.snabbdom),
    source(port.init).pipe(
      switchMap(({snabbdom}) => {
        const target = new EventTarget;
        return fromEvent<CustomEvent<ActionDetail>>(target as any, 'action').pipe(
          map(({detail}) =>
            sink(port.service.ifs.action)(detail)),
          startWith(sink(port.snabbdom.init)({...snabbdom,
            modules: [createActionModule(target), ...defaultModules]
          })))
      })),
    directProc(source(port.service.ifs.vnode), sink(port.snabbdom.render)),
  )