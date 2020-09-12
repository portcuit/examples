import {main} from '../../shared/client/main'
import {createCsr} from './'

const subject$ = main(createCsr);
subject$.subscribe({error: console.error});
Object.assign(globalThis, {subject$});
