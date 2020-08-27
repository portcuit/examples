import {merge} from "rxjs";
import {LifecyclePort, sink, source} from "pkit/core";
import {mapProc, mapToProc} from "pkit/processors";
import {stateKit, StatePort} from "pkit/state";
import {childRemoteWorkerKit} from "pkit/worker";
import {SnabbdomPort, snabbdomActionPatchKit} from "@pkit/snabbdom/csr";
import {View} from "./view";
import {State} from './processors'

export * from './processors'

export class Port extends LifecyclePort {
  state = new StatePort<State>();
  dom = new SnabbdomPort;
}

export const circuit = (port: Port) =>
  merge(
    childRemoteWorkerKit(port.debug, port.err, self as any, [
      port.ready,
      port.state.raw,
      port.dom.render,
    ]),
    stateKit(port.state),
    domKit(port),
    lifecycleKit(port),
  )

const lifecycleKit = (port: Port) =>
  merge(
    mapToProc(source(port.init), sink(port.ready)),
  )

const domKit = (port: Port) =>
  merge(
    snabbdomActionPatchKit(port.dom, port.state),
    mapProc(source(port.state.data), sink(port.dom.render),
      (state) => View(state)),
    mapProc(source(port.dom.event.hashchange), sink(port.state.patch),
      (hash) => ({
        scope: hash === '#/active' ? 'active' as const :
          hash === '#/completed' ? 'completed' as const : 'all' as const
      })),
  )
