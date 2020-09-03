import {mount} from "pkit";
import portcuit from './'

const subject$ = mount(portcuit);
subject$.subscribe({error: console.error})


Object.assign(globalThis, {subject$});