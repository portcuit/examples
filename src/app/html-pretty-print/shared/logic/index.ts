import unified from 'unified'
import stringify from 'rehype-stringify'
import parse from 'rehype-parse'
import format from 'rehype-format'
import {fromEvent, merge} from "rxjs";
import {filter, map, mergeMap, take} from "rxjs/operators";
import {EphemeralBoolean, mapProc, mergeMapProc, sink, source, StatePort} from "pkit";
import {State} from '../state'

interface Port {
  state: StatePort<State>
}

export const sharedLogicKit = (port: Port) =>
  merge(
    formatHtml(port)
  )

const formatHtml = (port: Port) =>
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
