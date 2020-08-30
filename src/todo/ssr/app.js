"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = exports.App = void 0;
const snabbdom_1 = require("@pkit/snabbdom");
exports.App = ({ src }) => snabbdom_1.jsx(exports.Layout, null,
    snabbdom_1.jsx("head", null,
        snabbdom_1.jsx("title", null, src),
        snabbdom_1.jsx("meta", { charset: "UTF-8" }),
        snabbdom_1.jsx("script", { type: "module", src: src })),
    snabbdom_1.jsx("body", null,
        snabbdom_1.jsx("main", null)));
exports.Layout = (_, children) => snabbdom_1.jsx("html", { lang: "ja" }, children);
//# sourceMappingURL=app.js.map