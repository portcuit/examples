import unified from 'unified'
import rehype from 'rehype'
import parse from 'rehype-parse'
import format from 'rehype-format'

import {merge} from "rxjs";
import {debounceTime, delay, filter} from "rxjs/operators";
import {EphemeralBoolean, mapProc, mergeMapProc, sink, Socket, source, StatePort} from "pkit";
import {State} from '../state'

type Port = {
  state: StatePort<State>
}

export const logicKit = (port: Port) =>
  merge(
    mergeMapProc(source(port.state.data).pipe(
      filter(({preventConvert}) =>
        !preventConvert)),
      sink(port.state.patch), async ({fromHtml}) =>
        ({
          toHtml: (await rehype().use(format).process(fromHtml)).contents as string,
          preventConvert: new EphemeralBoolean(true)
        })
    )
  )

