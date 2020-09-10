import {dirname} from 'path'
import {merge} from "rxjs";
import {get} from "pkit/http/server";
import {latestMapProc, latestMergeMapProc, mapProc, sink, source} from "pkit";
import server from '../../shared/server/'
import {RenderPort, sharedSsgKit, SharedSsgPort, sharedSsrKit, SharedSsrPort} from "../../shared/server/render";
import {State, initialState} from '../shared/state'
import {promisify} from "util";
import {writeFile} from "fs";

const appName = __dirname.split('/').reverse()[1];

const renderKit = (port: RenderPort<State>) =>
  latestMapProc(source(port.state.data), sink(port.vdom.render),
    [source(port.renderer.init)], ([state, Html]) =>
      Html(state)
  )

class SsrPort extends SharedSsrPort<State> {}

const ssrKit = (port: SsrPort) =>
  merge(
    renderKit(port),
    mapProc(get(`/${appName}/`, source(port.api.init)), sink(port.state.init), () =>
      initialState(appName)),
    sharedSsrKit(port),
  )

export const ssr = {Port: SsrPort, circuit: ssrKit}

class SsgPort extends SharedSsgPort<State> {}

const ssgKit = (port: SsgPort) =>
  merge(
    sharedSsgKit(port),
    renderKit(port),
    latestMergeMapProc(source(port.vdom.html), sink(port.terminated), [source(port.init)], ([html, {fileName}]) =>
      promisify(writeFile)(`${fileName}.html`, html)),
    mapProc(source(port.init), sink(port.state.init), () =>
      initialState()),
  )

export const ssg = {Port: SsgPort, circuit: ssgKit}

export default {...server, params:{server:{listen: [8080]}, pages: dirname(__dirname)}}
