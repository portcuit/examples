import {run} from "pkit/core";
import {Params, Port, circuit} from './';

const params: Params = {
  worker: {
    ctor: Worker,
    args: ['./esm/app/todo/service/main.js', {type: 'module'}]
  },
  snabbdom: {
    container: document.body.firstElementChild!
  }
}

const subject$ = run(new Port, circuit, params);
subject$.subscribe({
  error: (e) =>
    console.error(e)
})

Object.assign(globalThis, {subject$});
