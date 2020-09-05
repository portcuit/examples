import {
  childRemoteWorkerKit,
  directProc,
  LifecyclePort,
  mapProc,
  mapToProc,
  sink,
  source,
  stateKit,
  StatePort
} from "pkit";
import {snabbdomActionPatchKit, SnabbdomPort} from "@pkit/snabbdom/csr";
import {merge} from "rxjs";
import {State} from '../../shared/state'
import {Index} from '../../ui/'
import {filter} from "rxjs/operators";

export class Port extends LifecyclePort {
  state = new StatePort<State>();
  dom = new SnabbdomPort;
}

const circuit = (port: Port) =>
  merge(
    childRemoteWorkerKit(port, self as any, [
      port.ready,
      port.state.raw,
      port.dom.render
    ]),
    stateKit(port.state),
    domKit(port),
    mapToProc(source(port.init), sink(port.ready)),
    logicKit(port)
  )

const logicKit = (port: Port) =>
  merge(
    mapProc(source(port.state.data).pipe(filter(({format}) =>
        !!format)),
      sink(port.state.patch), ({fromHtml}) =>
        ({toHtml: fromHtml}))
  )

const domKit = (port: Port) =>
  merge(
    snabbdomActionPatchKit(port.dom, port.state),
    mapProc(source(port.state.data), sink(port.dom.render), (state) =>
      Index(state))
  )

export default {Port, circuit}

