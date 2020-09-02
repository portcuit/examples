import {mount} from "pkit";
import portcuit from './'

Object.assign(globalThis, {subject$: mount(portcuit)});