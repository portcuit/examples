import {injectGlobal} from 'emotion'
import {jsx} from 'snabbdom/jsx'
import {identity} from 'ramda'
import {EphemeralBoolean, splice, ReplaceArray} from "pkit/state";
import {action} from "@pkit/snabbdom";
import {State} from "./processors";

injectGlobal`
  @import url("https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css");
  @import url("https://cdn.jsdelivr.net/npm/todomvc-app-css@2.3.0/index.css");`

export const View = ({newTodo, items, scope}: State) =>
  <section sel=".todoapp">
    <header sel=".header">
      <h1>todos</h1>
      <input sel=".new-todo" placeholder="What needs to be done?" autofocus value={newTodo} bind={action<State, number>({
        keypress: ({key, currentTarget:{value}}) => (key === 'Enter' && value.length > 0) ? ({currentTarget:{value: title}, detail: length}) => ({
          newTodo: "",
          items: splice(length, 0, [{editing: false, completed: false, title}])
        }) : undefined
      }, items.length)} />
    </header>

    <section sel=".main">
      <input sel="#toggle-all.toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul sel=".todo-list">{items.filter(({completed}) => {
        switch (scope) {
          case 'all':
            return true;
          case 'active':
            return !completed;
          case 'completed':
            return completed;
        }})
        .map(({completed, editing, title, focus}, index) =>
        <li class={{editing, completed}} key={index}>
          <div sel=".view">
            <input sel=".toggle" type="checkbox" checked={completed} bind={action<State, number>({
              click: () => ({currentTarget: {checked: completed}, detail: index}) => ({
                items: splice(index,0,[{completed}])
              })
            }, index)} />
            <label detail={index} bind={action<State, number>({
              dblclick: () => ({detail: index}) => ({
                items: splice(index, 0, [{editing: true, focus: new EphemeralBoolean(false)}])
              }),
            }, index)}>{title}</label>
            <button sel=".destroy" bind={action<State, number>({
              click: () => ({detail: index}) => ({
                items: splice(index,1)
              })
            }, index)}> </button>
          </div>
          <input sel=".edit" value={title} trigger={{focus}} bind={action<State, number>({
            blur: () => ({detail: index}) => ({
              items: splice(index, 0, [{editing: false}])
            }),
            keydown: ({key}) => key === 'Escape' ? ({detail: index}) => ({
              items: splice(index, 0, [{editing: false}])
            }) : undefined,
            keypress: ({key}) => key === 'Enter' ? ({currentTarget: {value: title}, detail: index}) => ({
              items: splice(index, 0, [{title, editing: false}])
            }) : undefined
          }, index)} />
        </li>)}
      </ul>
    </section>

    <footer sel=".footer">
      <span sel=".todo-count"><strong>{items.filter(({completed}) => !completed).length}</strong> item left</span>
      <ul sel=".filters">
        <li>
          <a class={{selected: scope === 'all'}} href="#/">All</a>
        </li>
        <li>
          <a class={{selected: scope === 'active'}} href="#/active">Active</a>
        </li>
        <li>
          <a class={{selected: scope === 'completed'}} href="#/completed">Completed</a>
        </li>
      </ul>
      {...[items.some(({completed}) => completed) &&
      <button sel=".clear-completed" bind={action<State, State['items']>({
        click: () => ({detail: items}) => ({
          items: new ReplaceArray(...items)
        })
      }, items.filter(({completed}) => !completed))}>Clear completed</button>].filter(identity)}
    </footer>
  </section>
