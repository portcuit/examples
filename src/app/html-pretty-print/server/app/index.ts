import fetch from 'node-fetch'
import jschardet from 'jschardet'
import iconv from 'iconv-lite'
import {merge, of, zip} from "rxjs";
import {filter} from "rxjs/operators";
import {
  sink,
  source,
  mapProc,
  StatePort,
  stateKit,
  mergeMapProc,
  LifecyclePort,
  directProc,
  Socket,
  latestMapProc, mapToProc
} from "pkit";
import {
  HttpServerApiPort,
  post, RequestArgs, reqToUrl, get
} from "pkit/http/server";
import {initialState, State} from '../../shared/state'
import {sharedAppKit, SharedPort} from '../../shared/'
import {FC} from "@pkit/snabbdom";
import {SnabbdomSsrPort} from '@pkit/snabbdom/ssr'
import {httpServerApiKit, httpServerApiTerminateKit} from "pkit/http/server/index";

const appName = __dirname.split('/').reverse()[2];

export class SsrPort extends LifecyclePort<FC<State>> {}

export const ssrKit = (port: SsrPort, vdom: SnabbdomSsrPort, state: StatePort<State>) =>
  latestMapProc(source(state.data).pipe(filter(({preventConvert}) =>
      !!preventConvert)), sink(vdom.render), [source(port.init)] as const,
    ([state, Html]) =>
      Html(state))

type SsgParams = {
  Html: FC<State>;
  state: State;
}

export class ServerPort extends LifecyclePort<{requestArgs: RequestArgs, Html: FC<State>}> implements SharedPort {
  api = new HttpServerApiPort;
  state = new StatePort<State>();
  ssr = new SsrPort;
  vdom = new SnabbdomSsrPort;
}

export const serverKit = (port: ServerPort) =>
  merge(
    ssrKit(port.ssr, port.vdom, port.state),
    sharedAppKit(port),
    apiKit(port),
    mapProc(get(`/${appName}/`, source(port.api.init)), sink(port.state.init), ([req]) =>
      ({...initialState(), url: reqToUrl(req)})),

    httpServerApiKit(port.api),
    stateKit(port.state),
    mapProc(source(port.init), sink(port.api.init), ({requestArgs}) => requestArgs),
    mapToProc(source(port.init), sink(port.vdom.init)),
    mapProc(source(port.init), sink(port.ssr.init), ({Html}) => Html),
    directProc(source(port.vdom.html), sink(port.api.html)),
    mapToProc(source(port.api.terminated), sink(port.terminated)),
    httpServerApiTerminateKit(port.api)
  )

const apiKit = (port: ServerPort) =>
  merge(
    mergeMapProc(
      zip(post(`/${appName}/load-url/`, source(port.api.init)), source(port.api.body)),
      sink(port.api.html), async ([,body]) => {
        let html: string;
        try {
          const {url}: { url: string } = JSON.parse(body);
          const res = await fetch(url);
          const buffer = await res.buffer();
          const {encoding} = jschardet.detect(buffer);
          html = iconv.decode(buffer, encoding);
        } catch (e) {
          html = e.toString();
        }
        return html
      })
  )
