import {mount} from "pkit";
import {Params, Port, circuit} from './';
import EventTarget from '@ungap/event-target'

const params: Params = {
  worker: {
    ctor: Worker,
    args: ['/esm/app/markdown-converter/client/app/main.js', {type: 'module'}]
  },
  snabbdom: {
    container: document.body.firstElementChild!,
    target: new EventTarget,
    options: {
      window,
      hashchange: true
    }
  },
  state: JSON.parse(document.body.dataset.state!)
}

Object.assign(globalThis, {subject$: mount({Port, circuit, params})});
