"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("pkit/core");
const _1 = require("./");
const params = {
    worker: {
        ctor: Worker,
        args: ['/esm/app/todo/app/main.js', { type: 'module' }]
    },
    snabbdom: {
        container: document.body.firstElementChild,
        target: new EventTarget,
        options: {
            window,
            hashchange: true
        }
    },
};
const subject$ = core_1.entry(new _1.Port, _1.circuit, params);
subject$.subscribe({ error: (e) => console.error(e) });
Object.assign(globalThis, { subject$ });
//# sourceMappingURL=main.js.map