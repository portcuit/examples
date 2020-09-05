import unified from 'unified'
import stringify from 'rehype-stringify'
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
          toHtml: (await unified()
            .use(parse, {fragment: true})
            .use(format)
            .use(stringify)
            .process(fromHtml)).contents as string,
          preventConvert: new EphemeralBoolean(true)
        }))
  )

