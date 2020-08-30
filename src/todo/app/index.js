"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.circuit = exports.Port = void 0;
const rxjs_1 = require("rxjs");
const core_1 = require("pkit/core");
const processors_1 = require("pkit/processors");
const state_1 = require("pkit/state");
const worker_1 = require("pkit/worker");
const csr_1 = require("@pkit/snabbdom/csr");
const view_1 = require("./view");
__exportStar(require("./processors"), exports);
class Port extends core_1.LifecyclePort {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new state_1.StatePort()
        });
        Object.defineProperty(this, "dom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new csr_1.SnabbdomPort
        });
    }
}
exports.Port = Port;
exports.circuit = (port) => rxjs_1.merge(worker_1.childRemoteWorkerKit(port.debug, port.err, self, [
    port.ready,
    port.state.raw,
    port.dom.render,
]), state_1.stateKit(port.state), domKit(port), lifecycleKit(port));
const lifecycleKit = (port) => rxjs_1.merge(processors_1.mapToProc(core_1.source(port.init), core_1.sink(port.ready)));
const domKit = (port) => rxjs_1.merge(csr_1.snabbdomActionPatchKit(port.dom, port.state), processors_1.mapProc(core_1.source(port.state.data), core_1.sink(port.dom.render), (state) => view_1.View(state)), processors_1.mapProc(core_1.source(port.dom.event.hashchange), core_1.sink(port.state.patch), (hash) => ({
    scope: hash === '#/active' ? 'active' :
        hash === '#/completed' ? 'completed' : 'all'
})));
//# sourceMappingURL=index.js.map