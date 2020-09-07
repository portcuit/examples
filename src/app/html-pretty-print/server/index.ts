import fetch from 'node-fetch'
import jschardet from 'jschardet'
import iconv from 'iconv-lite'
import {merge, zip} from "rxjs";
import {sink, source, mapProc, StatePort, stateKit, mergeMapProc} from "pkit";
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
import {Ssr} from '../ui/'
import {delay, filter, switchMap} from "rxjs/operators";

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
    mapProc(get(`/${appName}/`, source(port.init)).pipe(delay(0)), sink(port.state.init), () =>
      initialState()),
    mapProc(source(port.state.data).pipe(filter(({preventConvert}) =>
      !!preventConvert)), sink(port.vnode), (state) =>
      Ssr(state)),
    httpServerApiTerminateKit(port)
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
      }),
  )

export default {Port: HttpServerPort, circuit: createDevKit({Port, circuit}), params: {listen: [8080]}}