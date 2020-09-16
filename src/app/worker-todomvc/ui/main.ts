import {main} from '@pkit/next/client'
import {createCsr} from './'

const subject$ = main(createCsr);
subject$.subscribe({error: console.error});
Object.assign(globalThis, {subject$});
