import { LifecyclePort, Socket } from "pkit/core";
import { WorkerParams } from "pkit/worker";
import { SnabbdomParams, SnabbdomPort } from "@pkit/snabbdom/csr";
import { Port as AppPort } from "../app/";
export declare type Params = {
    worker: WorkerParams;
    snabbdom: SnabbdomParams;
};
export declare class Port extends LifecyclePort<Params> {
    app: {
        ifs: AppPort;
        run: import("pkit").RunPort;
        worker: Socket<Worker>;
        err: Socket<Error>;
        msg: Socket<import("pkit/core").PortMessage<any>>;
        init: Socket<WorkerParams>;
        ready: Socket<any>;
        terminate: Socket<any>;
        terminated: Socket<any>;
        quit: Socket<any>;
        info: Socket<any>;
        debug: Socket<any>;
        running: Socket<boolean>;
        _ns?: string[] | undefined;
    };
    snabbdom: SnabbdomPort;
    state: Socket<any>;
}
export declare const circuit: (port: Port) => import("rxjs").Observable<import("pkit/core").PortMessage<boolean> | import("pkit/core").PortMessage<any> | import("pkit/core").PortMessage<Error> | import("pkit/core").PortMessage<string> | import("pkit/core").PortMessage<Worker> | import("pkit/core").PortMessage<import("snabbdom/build/package/vnode").VNode> | import("pkit/core").PortMessage<import("@pkit/snabbdom/csr").ActionDetail> | import("pkit/core").PortMessage<import("pkit/core").DeepPartial<import("../app").State>> | import("pkit/core").PortMessage<WorkerParams> | import("pkit/core").PortMessage<SnabbdomParams>>;
