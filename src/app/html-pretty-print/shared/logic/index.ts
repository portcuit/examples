import unified from 'unified'
import stringify from 'rehype-stringify'
import parse from 'rehype-parse'
import format from 'rehype-format'
import {fromEvent, merge} from "rxjs";
import {filter, map, mergeMap, take} from "rxjs/operators";
import {EphemeralBoolean, mapProc, mergeMapProc, sink, source, StatePort} from "pkit";
import {State} from '../state'

type Port = {
  state: StatePort<State>
}

export const logicKit = (port: Port) =>
  merge(
    formatHtml(port),
    loadFromFile(port)
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

const loadFromFile = (port: Port) =>
  mapProc(source(port.state.data).pipe(
    filter(({files}) =>
      !!files && !!files?.data?.[0]),
    mergeMap((state) => {
      const file = state.files!.data[0];
      const reader = new FileReader;
      setTimeout(() =>
        reader.readAsText(file), 0);
      return fromEvent<{currentTarget:{result:string}}>(reader, 'load').pipe(
        map(({currentTarget:{result}}) => result),
        take(1))
    })), sink(port.state.patch), (fromHtml) => ({fromHtml}))
