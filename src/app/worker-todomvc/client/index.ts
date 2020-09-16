import {VmPort, vmKit} from '@pkit/next/client'
import {State} from '../shared/state'

class Port extends VmPort<State> {}

export const csr = {Port, circuit: vmKit}
