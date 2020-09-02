import {identity} from 'ramda'
import {EphemeralBoolean, splice, ReplaceArray, padArray} from "pkit/state";
import Pkit, {FC} from '@pkit/snabbdom'
import {action} from "@pkit/snabbdom/csr";
import {State} from "../client/app";

export const App: FC<State> = ({newTodo, items, scope}) =>
  <section sel=".todoapp">
    <header sel=".header">
      <h1>todos</h1>
      <input sel=".new-todo" placeholder="What needs to be done?" autofocus value={newTodo} bind={action<State, number>({
        keypress: ({key, currentTarget:{value}}) => (key === 'Enter' && value.length > 0) ? ({currentTarget: {value: title}, detail: length}) => ({
          newTodo: "",
          items: padArray(length,{title, completed: false, editing: false})
        }) : undefined
      }, items.length)} />
    </header>{...[items.length > 0 &&

  <section sel=".main">
    <input sel="#toggle-all.toggle-all" type="checkbox" checked={items.every(({completed}) => completed)} bind={action<State, number>({
      change: () => ({detail: length, currentTarget: {checked}}) => ({
        items: [...Array(length)].map(() => ({
          completed: checked
        }))
      })
    }, items.length)} />
    <label for="toggle-all">Mark all as complete</label>
    <ul sel=".todo-list">{[...items.entries()].filter(([,{completed}]) => {
      switch (scope) {
        case 'all':
          return true;
        case 'active':
          return !completed;
        case 'completed':
          return completed;
      }})
      .map(([index, {completed, editing, title, focus}]) =>
        <li class={{editing, completed}} key={index}>
          <div sel=".view">
            <input sel=".toggle" type="checkbox" checked={completed} bind={action<State, number>({
              click: () => ({currentTarget: {checked: completed}, detail: index}) => ({
                items: padArray(index,{completed})
              })
            }, index)} />
            <label detail={index} bind={action<State, number>({
              dblclick: () => ({detail: index}) => ({
                items: padArray(index, {editing: true, focus: new EphemeralBoolean(false)})
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
              items: padArray(index,{sam: 'getan', editing: false})
            }),
            keydown: ({key}) => key === 'Escape' ? ({detail: index}) => ({
              items: padArray(index, {editing: false})
            }) : undefined,
            keypress: ({key}) => key === 'Enter' ? ({currentTarget: {value: title}, detail: index}) => ({
              items: padArray(index, {title, editing: false})
            }) : undefined
          }, index)} />
        </li>)}
    </ul>
  </section>].filter(identity)}{...[items.length > 0 &&

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
    </ul>{...[items.some(({completed}) => completed) &&

  <button sel=".clear-completed" bind={action<State, State['items']>({
    click: () => ({detail: items}) => ({
      items: new ReplaceArray(...items)
    })
  }, items.filter(({completed}) => !completed))}>Clear completed</button>].filter(identity)}
  </footer>].filter(identity)}
  </section>
