import {run} from "pkit/core";
import {Params, Port, circuit} from './';

const params: Params = {
  worker: {
    ctor: Worker,
    args: ['/esm/app/todo/app/main.js', {type: 'module'}]
  },
  snabbdom: {
    container: document.body.firstElementChild!
  },
  window,
  target: new EventTarget
  // window: globalThis,
  // location
}

const subject$ = run(new Port, circuit, params);
subject$.subscribe({error: (e) => console.error(e)})

Object.assign(globalThis, {subject$});
