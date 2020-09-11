import {VmPort, vmKit} from '../../shared/client/vm/'
import {State} from '../shared/state'

class Port extends VmPort<State> {}

export const csr = {Port, circuit: vmKit}
