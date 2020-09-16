import unified from 'unified'
import stringify from 'rehype-stringify'
import parse from 'rehype-parse'
import format from 'rehype-format'
import {fromEvent, merge} from "rxjs";
import {filter, map, mergeMap, take} from "rxjs/operators";
import {EphemeralBoolean, mapProc, mergeMapProc, sink, source, StatePort} from "pkit";
import {State} from './state'

export * from './state'

export interface SharedPort {
  state: StatePort<State>
}

export const sharedAppKit = (port: SharedPort) =>
  merge(
    formatHtml(port)
  )

const formatHtml = (port: SharedPort) =>
  mergeMapProc(source(port.state.data).pipe(
    filter(({preventConvert}) =>
      !preventConvert)), sink(port.state.patch),
    async ({fromHtml, options:{fragment, indentInitial, indent}}) =>
    ({
      toHtml: ((await unified()
        .use(parse, {fragment})
        .use(format, {indent, indentInitial})
        .use(stringify)
        .process(fromHtml)).contents as string).trim(),
      preventConvert: new EphemeralBoolean(true)
    }))
