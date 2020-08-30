/// <reference types="node" />
/// <reference types="src/vendor/pkit/types" />
import { Config } from 'serve-handler';
import { LifecyclePort } from "pkit";
import { HttpServerParams, HttpServerPort } from "pkit/http/server";
export declare type Params = {
    http: HttpServerParams;
    serveConfig: Config;
};
export declare const params: Params;
export declare class Port extends LifecyclePort<Params> {
    http: HttpServerPort;
}
export declare const circuit: (port: Port) => import("rxjs").Observable<import("pkit").PortMessage<boolean> | import("pkit").PortMessage<any> | import("pkit").PortMessage<import("http").Server> | import("pkit").PortMessage<Error> | import("pkit").PortMessage<import("pkit").RequestArgs> | import("pkit").PortMessage<HttpServerParams>>;
