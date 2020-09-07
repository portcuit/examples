import jschardet from 'jschardet'
import {fromEvent, merge} from "rxjs";
import {filter, map, mergeMap, take, withLatestFrom} from "rxjs/operators";
import {EphemeralBoolean, mapProc, mergeMapProc, sink, source, StatePort} from "pkit";
import type {Port} from '../app/'

export const logicKit = (port: Port) =>
  merge(
    loadFromFile(port),
    makeDownloadFile(port)
  )

const makeDownloadFile = (port: Port) =>
  mapProc(source(port.state.data).pipe(
    withLatestFrom(source(port.state.patch)),
    filter(([,{toHtml}]) => !!toHtml)), sink(port.state.patch), ([{toHtml, downloadFile}]) =>
    ({
      downloadFile: URL.createObjectURL(new Blob([toHtml], {type: "text/html"})),
      debug: URL.revokeObjectURL(downloadFile),
      preventConvert: new EphemeralBoolean(true)
    }));

const loadFromFile = (port: Port) =>
  mapProc(source(port.state.data).pipe(
    filter(({files}) =>
      !!files && !!files?.data?.[0]),
    mergeMap((state) => {
      const file = state.files!.data[0];
      const reader = new FileReader;
      setTimeout(() =>
        reader.readAsDataURL(file), 0);
      return fromEvent<{currentTarget:{result: string}}>(reader, 'load').pipe(
        map(({currentTarget:{result}}) => result),
        take(1),
        mergeMap((result) => {
          const str = atob(result.split(';base64,')[1]);
          const {encoding} = jschardet.detect(str);
          console.log(encoding);
          setTimeout(() =>
            reader.readAsText(file, encoding), 0);
          return fromEvent<any>(reader, 'load').pipe(
            map(({currentTarget:{result}}) => result),
            take(1))
        }))
    })), sink(port.state.patch), (fromHtml) => ({fromHtml}));

const loadFromUrl = (port: Port) => true
