import {merge} from "rxjs";
import {
  childRemoteWorkerKit, latestMapProc,
  LifecyclePort,
  mapProc,
  mapToProc,
  sink,
  source,
  stateKit,
  StatePort
} from "pkit";
import {snabbdomActionPatchKit, SnabbdomPort} from "@pkit/snabbdom/csr";

// import {State} from '../../shared/state'

import {FC} from "@pkit/snabbdom";

// import {sharedAppKit, SharedPort} from '../../shared/'
// import {Index} from '../../ui/'
// import {logicKit} from "../logic/";

export class VmPort<T> extends LifecyclePort<FC<T>> {
  state = new StatePort<T>();
  dom = new SnabbdomPort;
}

export const vmKit = <T>(port: VmPort<T>) =>
  merge(
    childRemoteWorkerKit(port, self as any, [
      port.ready,
      port.state.raw,
      port.dom.render
    ]),
    stateKit(port.state),
    snabbdomActionPatchKit(port.dom, port.state),

    latestMapProc(source(port.state.data), sink(port.dom.render),
      [source(port.init)], ([state, Body]) =>
        Body(state)),
    mapToProc(source(port.init), sink(port.ready))
    // mapToProc(source(port.init), sink(port.ready)),
    // sharedAppKit(port),
    // logicKit(port)

  )

// const domKit = (port: VmPort) =>
//   merge(
//     snabbdomActionPatchKit(port.dom, port.state),
//     // mapProc(source(port.state.data), sink(port.dom.render), (state) =>
//     //   Index(state))
//   )

export default {Port: VmPort, circuit: vmKit}