import type {VNode} from "snabbdom/vnode"
import {merge} from "rxjs";
import {DeepPartial, LifecyclePort, sink, Socket, source} from "pkit/core";
import {mapProc, mapToProc} from "pkit/processors";
import {EphemeralBoolean, stateKit, StatePort} from "pkit/state";
import {childRemoteWorkerKit} from "pkit/worker";
import {ActionDetail, actionProc} from "@pkit/snabbdom";
import {LayoutTpl} from "./ui/template";
import {State, compute} from './processors'

export * from './processors'

export class Port extends LifecyclePort {
  state = new StatePort<State>();
  vnode = new Socket<VNode>();
  action = new Socket<ActionDetail>();
  dev = new class {
    msgFocus = new Socket<void>();
  }
}

export const circuit = (port: Port) =>
  merge(
    childRemoteWorkerKit(port.debug, port.err, self as any, [
      port.vnode,
      port.state.raw,
      port.ready
    ]),
    stateKit(port.state, compute),
    uiKit(port),
    lifecycleKit(port),
    // devKit(port)
  )

const lifecycleKit = (port: Port) =>
  merge(
    mapToProc(source(port.init), sink(port.ready)),
  )

const uiKit = (port: Port) =>
  merge(
    mapProc(source(port.state.data), sink(port.vnode),
      (state) => LayoutTpl(state)),
    actionProc(source(port.action), sink(port.state.patch)),
  )

const devKit = (port: Port) =>
  merge(
  )
