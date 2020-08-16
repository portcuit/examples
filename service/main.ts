import {run} from "pkit/core";

import {Params, Port, circuit} from './'

const subject$ = run(new Port, circuit);

subject$.subscribe({
  error: (e) =>
    console.error(e)
})

const params: Params = {
  state: {
    msg: 'Hello World',
  }
}

subject$.next(['init', params]);
Object.assign(globalThis, {subject$});