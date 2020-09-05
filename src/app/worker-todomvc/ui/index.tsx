import {EphemeralBoolean, splice, ReplaceArray, padArray} from "pkit";
import Pkit, {FC, Touch} from '@pkit/snabbdom'
import {action} from "@pkit/snabbdom/csr/processors";
import {State} from "../shared/state";
import {SsrLayout} from './_layout'

export const Ssr: FC<{state: State, src: string}> = ({state, src}) =>
  <SsrLayout src={src}>
    <Csr {...state} />
  </SsrLayout>

export const Csr: FC<State> = ({newTodo, items, scope}) =>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus value={newTodo} bind={action<State, number>({
        keypress: ({key, currentTarget:{value}}) => (key === 'Enter' && value.length > 0) ? ({currentTarget: {value: title}, detail: length}) => ({
          newTodo: "",
          items: padArray(length,{title, completed: false, editing: false})
        }) : undefined
      }, items.length)} />
    </header>

    <Touch cond={items.length >= 1}>
      <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox" checked={items.every(({completed}) => completed)} bind={action<State, number>({
          change: () => ({detail: length, currentTarget: {checked}}) => ({
            items: [...Array(length)].map(() => ({
              completed: checked
            }))
          })
        }, items.length)} />
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">{[...items.entries()].filter(([,{completed}]) => {
          switch (scope) {
            case 'all':
              return true;
            case 'active':
              return !completed;
            case 'completed':
              return completed;
          }})
          .map(([index, {completed, editing, title, focus}]) =>
            <li classNames={{editing, completed}} key={index}>
              <div class="view">
                <input class="toggle" type="checkbox" checked={completed} bind={action<State, number>({
                  click: () => ({currentTarget: {checked: completed}, detail: index}) => ({
                    items: padArray(index,{completed})
                  })
                }, index)} />
                <label detail={index} bind={action<State, number>({
                  dblclick: () => ({detail: index}) => ({
                    items: padArray(index, {editing: true, focus: new EphemeralBoolean(false)})
                  }),
                }, index)}>{title}</label>
                <button class="destroy" bind={action<State, number>({
                  click: () => ({detail: index}) => ({
                    items: splice(index,1)
                  })
                }, index)}> </button>
              </div>
              <input class="edit" value={title} trigger={{focus}} bind={action<State, number>({
                blur: () => ({detail: index}) => ({
                  items: padArray(index,{editing: false})
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
      </section>
    </Touch>

    <Touch cond={items.length > 0}>
      <footer class="footer">
        <span class="todo-count"><strong>{items.filter(({completed}) => !completed).length}</strong> item left</span>
        <ul class="filters">
          <li>
            <a classNames={{selected: scope === 'all'}} href="#/">All</a>
          </li>
          <li>
            <a classNames={{selected: scope === 'active'}} href="#/active">Active</a>
          </li>
          <li>
            <a classNames={{selected: scope === 'completed'}} href="#/completed">Completed</a>
          </li>
        </ul>
        <Touch cond={items.some(({completed}) => completed)}>
          <button class="clear-completed" bind={action<State, State['items']>({
            click: () => ({detail: items}) => ({
              items: new ReplaceArray(...items)
            })
          }, items.filter(({completed}) => !completed))}>Clear completed</button>
        </Touch>
      </footer>
    </Touch>
  </section>

export const page = async () => {
  // @ts-ignore
  const md = getResource('./index.md')



}
