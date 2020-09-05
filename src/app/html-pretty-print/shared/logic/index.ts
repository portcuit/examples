import {merge} from "rxjs";
import {debounceTime, filter} from "rxjs/operators";
import {EphemeralBoolean, mapProc, sink, Socket, source, StatePort} from "pkit";
import {State} from '../state'

type Port = {
  state: StatePort<State>
}

export const logicKit = (port: Port) =>
  merge(
    mapProc(source(port.state.data).pipe(
      filter(({preventConvert}) =>
        !preventConvert)),
      sink(port.state.patch), ({fromHtml}) =>
        ({toHtml: fromHtml, preventConvert: new EphemeralBoolean(true)}))
  )
