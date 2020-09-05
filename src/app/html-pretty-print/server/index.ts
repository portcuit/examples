import {merge} from "rxjs";
import {sink, source, mapProc} from "pkit";
import {get, httpServerApiKit, HttpServerApiPort, httpServerApiTerminateKit, HttpServerPort} from "pkit/http/server";
import {createDevKit} from '../../../shared/server/dev'
import {initialState} from '../shared/state'
import {Ssr} from '../ui/'

const appName = __dirname.split('/').reverse()[1];

export const circuit = (port: HttpServerApiPort) =>
  merge(
    httpServerApiKit(port),
    mapProc(get(`/${appName}/index.html`, source(port.init)), sink(port.vnode), ([req]) =>
      Ssr(initialState())),
    httpServerApiTerminateKit(port)
  )

export default {Port: HttpServerPort, circuit: createDevKit(circuit), params: {listen: [8080]}}