import jschardet from "jschardet";
import {fromEvent, merge} from "rxjs";
import {filter, map, mergeMap, take, withLatestFrom} from "rxjs/operators";
import {EphemeralBoolean, mapProc, sink, source} from "pkit";
import {VmPort, vmKit} from '@pkit/next/client'
import {State, sharedAppKit} from '../shared/'

export class Port extends VmPort<State> {}

export const circuit = (port: Port) =>
  merge(
    vmKit(port),
    sharedAppKit(port),
    appKit(port),
  )

const appKit = (port: Port) =>
  merge(
    loadFromFile(port),
    makeDownloadFile(port),
    loadFromUrl(port)
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
    mergeMap(async (state) => {
      const file = state.files!.data[0];
      const reader = new FileReader;

      reader.readAsDataURL(file)
      const {currentTarget:{result: dataUrl}} =
        await fromEvent<{currentTarget:{result: string}}>(reader, 'load')
          .pipe(take(1)).toPromise();

      const {encoding} = jschardet.detect(atob(dataUrl.split(';base64,')[1]));

      reader.readAsText(file, encoding);
      return fromEvent<{currentTarget:{result: string}}>(reader, 'load')
        .pipe(take(1), map(({currentTarget:{result}}) =>
          result)).toPromise();
    })), sink(port.state.patch), (fromHtml) => ({fromHtml}));

const loadFromUrl = (port: Port) =>
  mapProc(source(port.state.data).pipe(
    withLatestFrom(source(port.state.patch)),
    filter(([,{loadUrl}]) => !!loadUrl),
    mergeMap(([{endpoint, loadUrl}]) =>
      fetch(`${endpoint}/load-url/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: loadUrl
        })
      })),
    mergeMap((res) =>
      res.text())
  ), sink(port.state.patch), (fromHtml) => ({fromHtml}))

export const csr = {Port, circuit}