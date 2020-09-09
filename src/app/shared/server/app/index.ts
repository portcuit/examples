import {directProc, LifecyclePort, mapProc, mapToProc, sink, source, stateKit, StatePort} from 'pkit'
import {RequestArgs} from "pkit/http/server";
import {FC} from "@pkit/snabbdom";
import {httpServerApiKit, HttpServerApiPort, httpServerApiTerminateKit} from "pkit/http/server/index";
import {snabbdomSsrKit, SnabbdomSsrPort} from "@pkit/snabbdom/ssr";
import {merge} from "rxjs";

export class SharedSsrPort<T> extends LifecyclePort<FC<T>> {}

export class SharedServerPort<T> extends LifecyclePort<{requestArgs: RequestArgs, Html: FC<T>}> {
  api = new HttpServerApiPort;
  state = new StatePort<T>();
  ssr = new SharedSsrPort<T>();
  vdom = new SnabbdomSsrPort;
}

export const sharedServerKit = <T>(port: SharedServerPort<T>) =>
  merge(
    httpServerApiKit(port.api),
    stateKit(port.state),
    snabbdomSsrKit(port.vdom),
    mapProc(source(port.init), sink(port.api.init), ({requestArgs}) => requestArgs),
    mapToProc(source(port.init), sink(port.vdom.init)),
    mapProc(source(port.init), sink(port.ssr.init), ({Html}) => Html),
    directProc(source(port.vdom.html), sink(port.api.html)),
    mapToProc(source(port.api.terminated), sink(port.terminated)),
    httpServerApiTerminateKit(port.api)
  )

export class SharedSsgPort<T> extends LifecyclePort<{fileName: string, Html: FC<T>}> {
  state = new StatePort<T>();
  ssr = new SharedSsrPort<T>();
  vdom = new SnabbdomSsrPort;
}

export const sharedSsgKit = <T>(port: SharedSsgPort<T>) =>
  merge(
    stateKit(port.state),
    snabbdomSsrKit(port.vdom),
    mapToProc(source(port.init), sink(port.vdom.init)),
    mapProc(source(port.init), sink(port.ssr.init), ({Html}) => Html),
  )