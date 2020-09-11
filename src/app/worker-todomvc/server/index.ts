import {merge} from "rxjs";
import {latestMapProc, latestMergeMapProc, mapProc, sink, source} from "pkit";
import {get} from "pkit/http/server";
import {
  RenderPort,
  sharedSsgKit,
  SharedSsgPort,
  sharedSsrKit,
  SharedSsrPort,
  ssgPublishKit
} from "../../shared/server/render";
import {State, initialState} from '../shared/state'

const appName = __dirname.split('/').reverse()[1];

const renderKit = (port: RenderPort<State>) =>
  latestMapProc(source(port.state.data), sink(port.vdom.render),
    [source(port.renderer.init)], ([state, Html]) =>
      Html(state))

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
    ssgPublishKit(port),
    mapProc(source(port.init), sink(port.state.init), () =>
      initialState(appName)),
  )

export const ssg = {Port: SsgPort, circuit: ssgKit}

