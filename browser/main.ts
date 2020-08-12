import {run} from "pkit/core";

import {Params, Port, circuit} from './'

const subject$ = run(new Port, circuit);

subject$.subscribe({
  next: ([type, data]) =>
    console.debug(type, data),
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
