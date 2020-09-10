import {VmPort, vmKit} from '../../shared/client/vm/'
import {State} from '../shared/state'

export class Port extends VmPort<State> {}

export const circuit = (port: Port) =>
  vmKit(port)

export default {Port, circuit}
