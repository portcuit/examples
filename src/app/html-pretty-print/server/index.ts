import fetch from 'node-fetch'
import jschardet from 'jschardet'
import iconv from 'iconv-lite'
import {merge, of, zip} from "rxjs";
import {filter, takeWhile} from "rxjs/operators";
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
  latestMapProc
} from "pkit";
import {
  get,
  httpServerApiKit,
  HttpServerApiPort,
  httpServerApiTerminateKit,
  HttpServerPort,
  post
} from "pkit/http/server";
import {createDevKit} from '../../shared/server/dev'
import {initialState, State} from '../shared/state'
import {sharedAppKit, SharedPort} from '../shared/'
import {FC} from "@pkit/snabbdom";
import {SnabbdomSsrParams, SnabbdomSsrPort} from '@pkit/snabbdom/ssr'

const appName = __dirname.split('/').reverse()[1];

class Port extends HttpServerApiPort implements SharedPort {
  state = new StatePort<State>();
}

export const circuit = (port: Port) =>
  merge(
    httpServerApiKit(port),
    stateKit(port.state),
    sharedAppKit(port),
    apiKit(port),

    // mapProc(get(`/${appName}/`, source(port.init)), sink(port.state.init), () =>
    //   initialState()),
    // mapProc(source(port.state.data).pipe(filter(({preventConvert}) =>
    //   !!preventConvert)), sink(port.vnode), (state) =>
    //   Html(state)),

    httpServerApiTerminateKit(port)
  )

type SsrParams = {
  url: {
    pathname: string
  },
  App: FC<State>
} & SnabbdomSsrParams

interface SsrPort extends SnabbdomSsrPort<SsrParams> {
  state: StatePort<State>;
}

export const ssrKit = (port: SsrPort) =>
  merge(
    mapProc(source(port.init), sink(port.state.init), ({url}) =>
      Object.assign(initialState(), {url})),
    latestMapProc(source(port.state.data).pipe(filter(({preventConvert}) =>
        !!preventConvert)), sink(port.render), [source(port.init)] as const,
      ([state, {App}]) =>
        App(state))
  )


const apiKit = (port: Port) =>
  merge(
    mergeMapProc(
      zip(post(`/${appName}/load-url/`, source(port.init)), source(port.body)),
      sink(port.html), async ([,body]) => {
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

export default {Port: HttpServerPort, circuit: createDevKit({Port, circuit}), params: {listen: [8080]}}