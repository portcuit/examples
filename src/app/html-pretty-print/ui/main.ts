import EventTarget from '@ungap/event-target'
import {mount} from "pkit";
import {ScreenParams, ScreenPort, screenKit} from '../../shared/client/screen/';
import {createCsr} from './'

let subject$;

if (globalThis.document) {
  const state = JSON.parse(document.querySelector('#state')!.textContent!);
  const params: ScreenParams = {
    worker: {
      ctor: Worker,
      args: [`${state.esmAppRoot}/main.js`, {type: 'module'}]
    },
    snabbdom: {
      container: document.body,
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
  subject$ = mount(createCsr());
}

subject$.subscribe({error: console.error})
Object.assign(globalThis, {subject$});
