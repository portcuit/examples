import {merge, of} from "rxjs";
import {LifecyclePort, source, sink, Socket} from "pkit/core";
import {
  directProc,
  latestMapProc,
  mapProc,
  mapToProc,
} from "pkit/processors";
import {workerKit, WorkerParams, WorkerPort, parentRemoteWorkerKit} from "pkit/worker";
import {snabbdomKit, SnabbdomParams, SnabbdomPort,} from "@pkit/snabbdom";
import {Port as AppPort, initial} from "../app/"

export type Params = {
  worker: WorkerParams,
  snabbdom: SnabbdomParams,
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
    useAppKit(port),
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

const useAppKit = (port: Port) =>
  merge(
    workerKit(port.app),
    parentRemoteWorkerKit(port.app, [
      port.app.ifs.state.init,
      port.app.ifs.dom.action,
      port.app.ifs.dom.event.hashchange
    ], port.app.ifs),
    mapProc(source(port.init), sink(port.app.init),
      ({worker}) => worker),
    mapToProc(source(port.app.ready), sink(port.app.running), true)
  )

const useSnabbdomKit = (port: Port) =>
  merge(
    snabbdomKit(port.snabbdom),
    mapProc(source(port.init), sink(port.snabbdom.init), ({snabbdom}) => snabbdom),
    directProc(source(port.snabbdom.action), sink(port.app.ifs.dom.action)),
    directProc(source(port.snabbdom.event.hashchange), sink(port.app.ifs.dom.event.hashchange)),
    directProc(source(port.app.ifs.dom.render), sink(port.snabbdom.render)),
  )