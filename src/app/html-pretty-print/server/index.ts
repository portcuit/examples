import {merge} from "rxjs";
import {sink, source, mapProc, StatePort, stateKit} from "pkit";
import {get, httpServerApiKit, HttpServerApiPort, httpServerApiTerminateKit, HttpServerPort} from "pkit/http/server";
import {createDevKit} from '../../../shared/server/dev'
import {initialState, State} from '../shared/state'
import {sharedLogicKit} from '../shared/logic/'
import {Ssr} from '../ui/'
import {delay, filter} from "rxjs/operators";

const appName = __dirname.split('/').reverse()[1];

class Port extends HttpServerApiPort {
  state = new StatePort<State>();
}

export const circuit = (port: Port) =>
  merge(
    httpServerApiKit(port),
    stateKit(port.state),
    sharedLogicKit(port),
    mapProc(get(`/${appName}/`, source(port.init)).pipe(delay(0)), sink(port.state.init), () =>
      initialState()),
    mapProc(source(port.state.data).pipe(filter(({preventConvert}) =>
      !!preventConvert)), sink(port.vnode), (state) =>
      Ssr(state)),
    httpServerApiTerminateKit(port)
  )

export default {Port: HttpServerPort, circuit: createDevKit({Port, circuit}), params: {listen: [8080]}}