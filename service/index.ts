import type {VNode} from "snabbdom/vnode"
import {merge} from "rxjs";
import {DeepPartial, LifecyclePort, sink, Socket, source} from "pkit/core";
import {directProc, latestMapProc, mapProc, mapToProc} from "pkit/processors";
import {stateKit, StatePort} from "pkit/state";
import {childRemoteWorkerKit} from "pkit/worker";
import {State, compute} from './processors'
import {LayoutTpl} from "./ui/template";

export type Params = {
  state: DeepPartial<State>
}

export class Port extends LifecyclePort<Params> {
  state = new StatePort<State>();
  vnode = new Socket<VNode>();
}

export const circuit = (port: Port) =>
  merge(
    childRemoteWorkerKit(port.debug, port.err, self as any, [
      port.vnode,
      port.state.raw,
      port.ready
    ]),
    uiKit(port),
    useStateKit(port),
    mapToProc(source(port.init), sink(port.ready)),
  )

const uiKit = (port: Port) =>
  merge(
    mapProc(source(port.state.data), sink(port.vnode),
      (state) => LayoutTpl(state))
  )

const useStateKit = (port: Port) =>
  merge(
    stateKit(port.state, compute),
    latestMapProc(source(port.ready), sink(port.state.init), [source(port.init)],
      ([,{state}]) => state)
  )
