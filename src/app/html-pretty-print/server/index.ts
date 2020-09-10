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
  mergeMapProc,
  latestMapProc, latestMergeMapProc
} from "pkit";
import {post, get} from "pkit/http/server";
import server from '../../shared/server/'
import {
  SharedSsrPort,
  sharedSsrKit,
  SharedSsgPort,
  sharedSsgKit, RenderPort
} from '../../shared/server/render/'
import {initialState, State} from '../shared/state'
import {sharedAppKit, SharedPort} from '../shared/'

const appName = __dirname.split('/').reverse()[1];

export const renderKit = (port: RenderPort<State>) =>
  latestMapProc(source(port.state.data).pipe(filter(({preventConvert}) =>
      !!preventConvert)), sink(port.vdom.render), [source(port.renderer.init)] as const,
    ([state, Html]) =>
      Html(state))

export class SsrPort extends SharedSsrPort<State> {}

export const ssrKit = (port: SsrPort) =>
  merge(
    mapProc(get(`/${appName}/`, source(port.api.init)), sink(port.state.init), () => initialState()),
    renderKit(port),
    sharedAppKit(port),
    apiKit(port),
    sharedSsrKit(port)
  )

const apiKit = (port: SsrPort) =>
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
    renderKit(port),
    sharedAppKit(port),
    mapProc(source(port.init), sink(port.state.init), () => initialState()),
    latestMergeMapProc(source(port.vdom.html), sink(port.terminated), [source(port.init)], ([html,{fileName}]) =>
      promisify(writeFile)(`${fileName}.html`, html))
  )

export default {...server, params:{server: {listen: [8080]}, ui: `${__dirname}/../ui`}}
