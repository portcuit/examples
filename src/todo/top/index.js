"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.circuit = exports.Port = void 0;
const rxjs_1 = require("rxjs");
const core_1 = require("pkit/core");
const processors_1 = require("pkit/processors");
const worker_1 = require("pkit/worker");
const csr_1 = require("@pkit/snabbdom/csr");
const app_1 = require("../app/");
class Port extends core_1.LifecyclePort {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "app", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new class extends worker_1.WorkerPort {
                constructor() {
                    super(...arguments);
                    Object.defineProperty(this, "ifs", {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value: new app_1.Port
                    });
                }
            }
        });
        Object.defineProperty(this, "snabbdom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new csr_1.SnabbdomPort
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new core_1.Socket()
        });
    }
}
exports.Port = Port;
exports.circuit = (port) => rxjs_1.merge(useAppKit(port), useSnabbdomKit(port), lifecycleKit(port));
const lifecycleKit = (port) => rxjs_1.merge(processors_1.directProc(core_1.source(port.app.ifs.state.raw), core_1.sink(port.state)), processors_1.latestMapProc(core_1.source(port.app.ifs.ready), core_1.sink(port.app.ifs.state.init), [core_1.source(port.state)], ([, state]) => state), processors_1.directProc(rxjs_1.of(app_1.initial), core_1.sink(port.state)));
const useAppKit = (port) => rxjs_1.merge(worker_1.workerKit(port.app), worker_1.parentRemoteWorkerKit(port.app, [
    port.app.ifs.state.init,
    port.app.ifs.dom.action,
    port.app.ifs.dom.event.hashchange
], port.app.ifs), processors_1.mapProc(core_1.source(port.init), core_1.sink(port.app.init), ({ worker }) => worker), processors_1.mapToProc(core_1.source(port.app.ready), core_1.sink(port.app.running), true));
const useSnabbdomKit = (port) => rxjs_1.merge(csr_1.snabbdomKit(port.snabbdom), processors_1.mapProc(core_1.source(port.init), core_1.sink(port.snabbdom.init), ({ snabbdom }) => snabbdom), processors_1.directProc(core_1.source(port.snabbdom.action), core_1.sink(port.app.ifs.dom.action)), processors_1.directProc(core_1.source(port.snabbdom.event.hashchange), core_1.sink(port.app.ifs.dom.event.hashchange)), processors_1.directProc(core_1.source(port.app.ifs.dom.render), core_1.sink(port.snabbdom.render)));
//# sourceMappingURL=index.js.map