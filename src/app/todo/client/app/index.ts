import {merge} from "rxjs";
import {LifecyclePort, sink, source, mapProc, mapToProc,
  stateKit, StatePort, childRemoteWorkerKit
} from "pkit";
import {SnabbdomPort, snabbdomActionPatchKit} from "@pkit/snabbdom/csr";
import {Csr} from "../../ui/";
import {State} from '../../shared/state'

export class Port extends LifecyclePort {
  state = new StatePort<State>();
  dom = new SnabbdomPort;
}

const circuit = (port: Port) =>
  merge(
    childRemoteWorkerKit(port, self as any, [
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
      (state) => Csr(state)),
    mapProc(source(port.dom.event.hashchange), sink(port.state.patch),
      (hash) => ({
        scope: hash === '#/active' ? 'active' as const :
          hash === '#/completed' ? 'completed' as const : 'all' as const
      })),
  )

export default {Port, circuit}