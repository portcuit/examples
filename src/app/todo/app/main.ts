import {entry} from "pkit/core";
import {Port, circuit} from './'

const subject$ = entry(new Port, circuit);
subject$.subscribe({error: (e) => console.error(e)})

Object.assign(globalThis, {subject$});