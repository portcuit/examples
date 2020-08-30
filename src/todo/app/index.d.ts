import { LifecyclePort } from "pkit/core";
import { StatePort } from "pkit/state";
import { SnabbdomPort } from "@pkit/snabbdom/csr";
import { State } from './processors';
export * from './processors';
export declare class Port extends LifecyclePort {
    state: StatePort<State>;
    dom: SnabbdomPort;
}
export declare const circuit: (port: Port) => import("rxjs").Observable<import("pkit/core").PortMessage<any> | import("pkit/core").PortMessage<Error> | import("pkit/core").PortMessage<import("snabbdom/build/package/vnode").VNode> | import("pkit/core").PortMessage<import("pkit/core").DeepPartial<State>> | import("pkit/core").PortMessage<State>>;
