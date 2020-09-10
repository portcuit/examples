import EventTarget from '@ungap/event-target'
import {mount} from "pkit";
import {ScreenParams, ScreenPort, screenKit} from '../../shared/client/screen/';
import {csr} from './'

let subject$;

if (globalThis.document) {
  const state = JSON.parse(document.querySelector('#state')!.textContent!);
  const params: ScreenParams = {
    worker: {
      ctor: Worker,
      args: [`${state.esmAppRoot}/main.js`, {type: 'module'}]
    },
    snabbdom: {
      container: document.body.firstElementChild!,
      target: new EventTarget,
      options: {
        window,
        hashchange: true
      }
    },
    state
  }
  subject$ = mount({Port: ScreenPort, circuit: screenKit, params});
} else {
  subject$ = mount(csr());
}

subject$.subscribe({error: console.error})
Object.assign(globalThis, {subject$});
