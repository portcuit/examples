import {mount} from "pkit";
import {Params, Port, circuit} from './';
import EventTarget from '@ungap/event-target'

const params: Params = {
  worker: {
    ctor: Worker,
    args: ['/esm/app/html-pretty-print/client/app/main.js', {type: 'module'}]
  },
  snabbdom: {
    container: document.body.firstElementChild!,
    target: new EventTarget,
    options: {
      window,
      hashchange: true
    }
  },
  state: JSON.parse(document.querySelector('#state')!.textContent!)
}

const subject$ = mount({Port, circuit, params});
subject$.subscribe({error: console.error})

Object.assign(globalThis, {subject$});
