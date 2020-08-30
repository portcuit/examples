import {merge} from "rxjs";
import {sink, source} from "pkit/core";
import {mapProc} from "pkit/processors";
import {get} from "@pkit/http";
import {httpServerApiTerminateKit, httpServerApiKit, HttpServerApiPort} from "@pkit/http/api";
import {Esm} from './template'

export class Port extends HttpServerApiPort {}

export const circuit = (port: Port) =>
  merge(
    httpServerApiKit(port),
    apiKit(port),
    httpServerApiTerminateKit(port)
  )

const apiKit = (port: Port) =>
  merge(
    mapProc(get('/', source(port.init)), sink(port.json), () => ({
      msg: 'Hello World'
    })),
    mapProc(get('/hello.html', source(port.init)), sink(port.html), () =>
      `<p>hello</p>`),

    mapProc(get('/**/*.html', source(port.init)), sink(port.vnode),
      ([req]) => Esm({src: req.url!.replace('.html', '.js')}))
  )