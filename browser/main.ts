import {PortMessage, run} from "pkit/core";
import {Params, Port, circuit} from './';

Object.assign(globalThis, {env: {NODE_DEBUG: 'portcuit'}})

const subject$ = run(new Port, circuit);

subject$.subscribe({
  // next: (msg) =>
  //   console.debug(msg),
  error: (e) =>
    console.error(e)
})

const params: Params = {
  worker: {
    ctor: Worker,
    args: ['./esm/app/todo/service/main.js', {type: 'module'}]
  },
  snabbdom: {
    container: document.body.firstElementChild!
  }
}

subject$.next(['init', params]);

Object.assign(globalThis, {subject$});
