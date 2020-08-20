import type {VNode} from "snabbdom/vnode"
import {merge} from "rxjs";
import {LifecyclePort, sink, Socket, source} from "pkit/core";
import {mapProc, mapToProc} from "pkit/processors";
import {stateKit, StatePort} from "pkit/state";
import {childRemoteWorkerKit} from "pkit/worker";
import {ActionDetail, actionProc} from "@pkit/snabbdom";
import {View} from "./view";
import {State} from './processors'

export * from './processors'

export class Port extends LifecyclePort {
  state = new StatePort<State>();
  vnode = new Socket<VNode>();
  action = new Socket<ActionDetail>();
  dom = new class {
    event = new class {
      hashchange = new Socket<string>();
    }
  }
}

export const circuit = (port: Port) =>
  merge(
    childRemoteWorkerKit(port.debug, port.err, self as any, [
      port.vnode,
      port.state.raw,
      port.ready
    ]),
    stateKit(port.state),
    uiKit(port),
    lifecycleKit(port),
  )

const lifecycleKit = (port: Port) =>
  merge(
    mapToProc(source(port.init), sink(port.ready)),
  )

const uiKit = (port: Port) =>
  merge(
    mapProc(source(port.state.data), sink(port.vnode),
      (state) => View(state)),
    actionProc(source(port.action), sink(port.state.patch)),
    mapProc(source(port.dom.event.hashchange), sink(port.state.patch),
      (hash) => ({
        scope: hash === '#/active' ? 'active' as const :
          hash === '#/completed' ? 'completed' as const : 'all' as const
      })),
  )
