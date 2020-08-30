"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
const emotion_1 = require("emotion");
const ramda_1 = require("ramda");
const state_1 = require("pkit/state");
const snabbdom_1 = require("@pkit/snabbdom");
const csr_1 = require("@pkit/snabbdom/csr");
emotion_1.injectGlobal `
  @import url("https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css");
  @import url("https://cdn.jsdelivr.net/npm/todomvc-app-css@2.3.0/index.css");`;
exports.View = ({ newTodo, items, scope }) => snabbdom_1.jsx("section", { sel: ".todoapp" },
    snabbdom_1.jsx("header", { sel: ".header" },
        snabbdom_1.jsx("h1", null, "todos"),
        snabbdom_1.jsx("input", { sel: ".new-todo", placeholder: "What needs to be done?", autofocus: true, value: newTodo, bind: csr_1.action({
                keypress: ({ key, currentTarget: { value } }) => (key === 'Enter' && value.length > 0) ? ({ currentTarget: { value: title }, detail: length }) => ({
                    newTodo: "",
                    items: state_1.padArray(length, { title, completed: false, editing: false })
                }) : undefined
            }, items.length) })),
    [items.length > 0 &&
            snabbdom_1.jsx("section", { sel: ".main" },
                snabbdom_1.jsx("input", { sel: "#toggle-all.toggle-all", type: "checkbox", checked: items.every(({ completed }) => completed), bind: csr_1.action({
                        change: () => ({ detail: length, currentTarget: { checked } }) => ({
                            items: [...Array(length)].map(() => ({
                                completed: checked
                            }))
                        })
                    }, items.length) }),
                snabbdom_1.jsx("label", { for: "toggle-all" }, "Mark all as complete"),
                snabbdom_1.jsx("ul", { sel: ".todo-list" }, [...items.entries()].filter(([, { completed }]) => {
                    switch (scope) {
                        case 'all':
                            return true;
                        case 'active':
                            return !completed;
                        case 'completed':
                            return completed;
                    }
                })
                    .map(([index, { completed, editing, title, focus }]) => snabbdom_1.jsx("li", { class: { editing, completed }, key: index },
                    snabbdom_1.jsx("div", { sel: ".view" },
                        snabbdom_1.jsx("input", { sel: ".toggle", type: "checkbox", checked: completed, bind: csr_1.action({
                                click: () => ({ currentTarget: { checked: completed }, detail: index }) => ({
                                    items: state_1.padArray(index, { completed })
                                })
                            }, index) }),
                        snabbdom_1.jsx("label", { detail: index, bind: csr_1.action({
                                dblclick: () => ({ detail: index }) => ({
                                    items: state_1.padArray(index, { editing: true, focus: new state_1.EphemeralBoolean(false) })
                                }),
                            }, index) }, title),
                        snabbdom_1.jsx("button", { sel: ".destroy", bind: csr_1.action({
                                click: () => ({ detail: index }) => ({
                                    items: state_1.splice(index, 1)
                                })
                            }, index) }, " ")),
                    snabbdom_1.jsx("input", { sel: ".edit", value: title, trigger: { focus }, bind: csr_1.action({
                            blur: () => ({ detail: index }) => ({
                                items: state_1.padArray(index, { sam: 'getan', editing: false })
                            }),
                            keydown: ({ key }) => key === 'Escape' ? ({ detail: index }) => ({
                                items: state_1.padArray(index, { editing: false })
                            }) : undefined,
                            keypress: ({ key }) => key === 'Enter' ? ({ currentTarget: { value: title }, detail: index }) => ({
                                items: state_1.padArray(index, { title, editing: false })
                            }) : undefined
                        }, index) })))))].filter(ramda_1.identity),
    [items.length > 0 &&
            snabbdom_1.jsx("footer", { sel: ".footer" },
                snabbdom_1.jsx("span", { sel: ".todo-count" },
                    snabbdom_1.jsx("strong", null, items.filter(({ completed }) => !completed).length),
                    " item left"),
                snabbdom_1.jsx("ul", { sel: ".filters" },
                    snabbdom_1.jsx("li", null,
                        snabbdom_1.jsx("a", { class: { selected: scope === 'all' }, href: "#/" }, "All")),
                    snabbdom_1.jsx("li", null,
                        snabbdom_1.jsx("a", { class: { selected: scope === 'active' }, href: "#/active" }, "Active")),
                    snabbdom_1.jsx("li", null,
                        snabbdom_1.jsx("a", { class: { selected: scope === 'completed' }, href: "#/completed" }, "Completed"))),
                [items.some(({ completed }) => completed) &&
                        snabbdom_1.jsx("button", { sel: ".clear-completed", bind: csr_1.action({
                                click: () => ({ detail: items }) => ({
                                    items: new state_1.ReplaceArray(...items)
                                })
                            }, items.filter(({ completed }) => !completed)) }, "Clear completed")].filter(ramda_1.identity))].filter(ramda_1.identity));
//# sourceMappingURL=view.js.map