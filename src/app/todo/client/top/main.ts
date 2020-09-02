import {mount} from "pkit";
import {Params, Port, circuit} from './';

const params: Params = {
  worker: {
    ctor: Worker,
    args: ['/esm/app/todo/client/app/main.js', {type: 'module'}]
  },
  snabbdom: {
    container: document.body.firstElementChild!,
    target: new EventTarget,
    options: {
      window,
      hashchange: true
    }
  }
}

Object.assign(globalThis, {subject$: mount({Port, circuit, params})});
