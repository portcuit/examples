"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.circuit = exports.Port = exports.params = void 0;
const serve_handler_1 = __importDefault(require("serve-handler"));
const rxjs_1 = require("rxjs");
const pkit_1 = require("pkit");
const server_1 = require("pkit/http/server");
const app_1 = require("./app");
exports.params = {
    http: {
        listen: [10080]
    },
    serveConfig: {
        public: './',
        cleanUrls: false,
        headers: [{
                source: "*",
                headers: [{
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate'
                    }]
            }]
    }
};
class Port extends pkit_1.LifecyclePort {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "http", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new server_1.HttpServerPort
        });
    }
}
exports.Port = Port;
exports.circuit = (port) => rxjs_1.merge(server_1.httpServerKit(port.http), useApiKit(port), staticKit(port), lifecycleKit(port));
const lifecycleKit = (port) => rxjs_1.merge(pkit_1.mapProc(pkit_1.source(port.init), pkit_1.sink(port.http.init), ({ http }) => http), pkit_1.mapToProc(pkit_1.source(port.http.ready), pkit_1.sink(port.http.running), true));
const staticKit = (port) => pkit_1.latestMergeMapProc(server_1.route('**', pkit_1.source(port.http.event.request)), pkit_1.sink(port.http.debug), [pkit_1.source(port.init)], async ([[req, res], { serveConfig }]) => {
    // if (req.url!.startsWith('/node_modules/') && req.url!.match(/\/[^.]+$/)) {
    //   req.url = `${req.url}.js`;
    // }
    return { handler: await serve_handler_1.default(req, res, serveConfig) };
});
const useApiKit = (port) => pkit_1.mergeMapProc(pkit_1.source(port.http.event.request), pkit_1.sink(port.debug), (data) => pkit_1.terminatedComplete(pkit_1.entry(new ApiPort, apiKit, data)));
class ApiPort extends server_1.HttpServerApiPort {
}
const apiKit = (port) => rxjs_1.merge(server_1.httpServerApiKit(port), routeKit(port), server_1.httpServerApiTerminateKit(port));
const routeKit = (port) => rxjs_1.merge(pkit_1.mapProc(server_1.get('/', pkit_1.source(port.init)), pkit_1.sink(port.json), () => ({
    msg: 'Hello World'
})), pkit_1.mapProc(server_1.get('/hello.html', pkit_1.source(port.init)), pkit_1.sink(port.html), () => `<p>hello</p>`), pkit_1.mapProc(server_1.get('/**/*.html', pkit_1.source(port.init)), pkit_1.sink(port.vnode), ([req]) => app_1.App({ src: req.url.replace('.html', '.js') })));
//# sourceMappingURL=index.js.map