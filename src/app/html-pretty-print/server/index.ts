import fetch from 'node-fetch'
import jschardet from 'jschardet'
import iconv from 'iconv-lite'
import {merge, of, zip} from "rxjs";
import {filter} from "rxjs/operators";
import {
  sink,
  source,
  mapProc,
  mergeMapProc,
  latestMapProc, latestMergeMapProc, Portcuit, RootCircuit, LifecyclePort
} from "pkit";
import {post, get} from "pkit/http/server";
import {
  SharedSsrPort,
  sharedSsrKit,
  SharedSsgPort,
  sharedSsgKit, RenderPort, ssgPublishKit
} from '../../shared/server/render/'
import {initialState, State} from '../shared/state'
import {sharedAppKit} from '../shared/'

const appName = __dirname.split('/').reverse()[1];

export const renderKit = (port: RenderPort<State>) =>
  latestMapProc(source(port.state.data).pipe(filter(({preventConvert}) =>
      !!preventConvert)), sink(port.vdom.render), [source(port.renderer.init)] as const,
    ([state, Html]) =>
      Html(state))

export class SsrPort extends SharedSsrPort<State> {}

export const ssrKit = (port: SsrPort) =>
  merge(
    mapProc(get(`/${appName}/`, source(port.api.init)), sink(port.state.init), () =>
      initialState(appName)),
    renderKit(port),
    sharedAppKit(port),
    loadUrl(port),
    sharedSsrKit(port)
  )

export const ssr = {Port: SsrPort, circuit: ssrKit}

const loadUrl = (port: SsrPort) =>
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

class SsgPort extends SharedSsgPort<State> {}

export const ssgKit = (port: SsgPort) =>
  merge(
    sharedSsgKit(port),
    renderKit(port),
    sharedAppKit(port),
    mapProc(source(port.init), sink(port.state.init), () =>
      initialState(appName)),
    ssgPublishKit(port)
  )

export const ssg = {Port: SsgPort, circuit: ssgKit}
