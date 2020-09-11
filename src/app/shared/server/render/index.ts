import {directProc, LifecyclePort, mapProc, mapToProc, RootCircuit, sink, source, stateKit, StatePort, Portcuit} from 'pkit'
import {RequestArgs} from "pkit/http/server";
import {FC} from "@pkit/snabbdom";
import {httpServerApiKit, HttpServerApiPort, httpServerApiTerminateKit} from "pkit/http/server/index";
import {snabbdomSsrKit, SnabbdomSsrPort} from "@pkit/snabbdom/ssr";
import {merge} from "rxjs";

class RendererPort<T> extends LifecyclePort<FC<T>> {}

export interface RenderPort<T> {
  renderer: RendererPort<T>;
  state: StatePort<T>;
  vdom: SnabbdomSsrPort;
}

export class SharedSsrPort<T> extends LifecyclePort<{requestArgs: RequestArgs, Html: FC<T>}> implements RenderPort<T> {
  api = new HttpServerApiPort;
  state = new StatePort<T>();
  renderer = new RendererPort<T>();
  vdom = new SnabbdomSsrPort;
}

export const sharedSsrKit = <T>(port: SharedSsrPort<T>) =>
  merge(
    httpServerApiKit(port.api),
    stateKit(port.state),
    snabbdomSsrKit(port.vdom),
    mapProc(source(port.init), sink(port.api.init), ({requestArgs}) => requestArgs),
    mapToProc(source(port.init), sink(port.vdom.init)),
    mapProc(source(port.init), sink(port.renderer.init), ({Html}) => Html),
    directProc(source(port.vdom.html), sink(port.api.html)),
    mapToProc(source(port.api.terminated), sink(port.terminated)),
    httpServerApiTerminateKit(port.api)
  )

export type SsgInfo = [fileName: string, input: string, output: string];

type SsgParams<T> = {
  info: SsgInfo,
  Html: FC<T>
}

export class SharedSsgPort<T> extends LifecyclePort<SsgParams<T>> implements RenderPort<T> {
  state = new StatePort<T>();
  renderer = new RendererPort<T>();
  vdom = new SnabbdomSsrPort;
}

export const sharedSsgKit = <T>(port: SharedSsgPort<T>) =>
  merge(
    stateKit(port.state),
    snabbdomSsrKit(port.vdom),
    mapToProc(source(port.init), sink(port.vdom.init)),
    mapProc(source(port.init), sink(port.renderer.init), ({Html}) => Html),
  )

export type CreateSsg<T> = (...ssgInfo: SsgInfo) => Portcuit<SharedSsgPort<T>>