import {run} from "pkit/core";
import {Params, Port, circuit} from './'

const params: Params = {
  state: {
    msg: 'Hello World',
  }
}

const subject$ = run(new Port, circuit, params);
subject$.subscribe({error: (e) => console.error(e)})

Object.assign(globalThis, {subject$});