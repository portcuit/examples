import {promisify} from "util";
import {writeFile} from 'fs'
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
  mergeMapProc,
  latestMapProc, LifecyclePort, latestMergeMapProc
} from "pkit";
import {post, reqToUrl, get} from "pkit/http/server";
import {
  SharedServerPort,
  sharedServerKit,
  SharedSsrPort,
  SharedSsgPort,
  sharedSsgKit
} from '../../../shared/server/app/'
import {initialState, State} from '../../shared/state'
import {sharedAppKit, SharedPort} from '../../shared/'
import {SnabbdomSsrPort} from '@pkit/snabbdom/ssr'

const appName = __dirname.split('/').reverse()[2];

export class ServerPort extends SharedServerPort<State> {}

export const ssrKit = (port: SharedSsrPort<State>, vdom: SnabbdomSsrPort, state: StatePort<State>) =>
  latestMapProc(source(state.data).pipe(filter(({preventConvert}) =>
      !!preventConvert)), sink(vdom.render), [source(port.init)] as const,
    ([state, Html]) =>
      Html(state))

export const serverKit = (port: ServerPort) =>
  merge(
    mapProc(get(`/${appName}/`, source(port.api.init)), sink(port.state.init), ([req]) =>
      ({...initialState(), url: reqToUrl(req)})),
    ssrKit(port.ssr, port.vdom, port.state),
    sharedAppKit(port),
    apiKit(port),
    sharedServerKit(port)
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

export class SsgPort extends SharedSsgPort<State> {}

export const ssgKit = (port: SsgPort) =>
  merge(
    sharedSsgKit(port),
    ssrKit(port.ssr, port.vdom, port.state),
    sharedAppKit(port),
    mapProc(source(port.init), sink(port.state.init), () =>
      ({...initialState()})),
    latestMergeMapProc(source(port.vdom.html), sink(port.terminated), [source(port.init)], ([html,{fileName}]) =>
      promisify(writeFile)(`${fileName}.html`, html))
  )
