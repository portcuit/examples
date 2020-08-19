import {injectGlobal} from 'emotion'
import {jsx} from 'snabbdom/jsx'
import {DeepPartial} from 'pkit/core'
import {EphemeralBoolean, splice} from "pkit/state";
import {State} from "../processors";
import {bindAction} from "@pkit/snabbdom";


injectGlobal`
  @import url("https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css");
  @import url("https://cdn.jsdelivr.net/npm/todomvc-app-css@2.3.0/index.css");
`

export const LayoutTpl = ({newTodo, items}: State) =>
  <section sel=".todoapp" dataset={{hoge: "huga"}} json={true}>
    <header sel=".header">
      <h1>todos</h1>
      <input sel=".new-todo" placeholder="What needs to be done?" value={newTodo} autofocus action={bindAction<State>({
        keypress: ({key}) => {
          if (key === 'Enter') {
            return ({currentTarget:{value}}) => ({})
          }
        }
      })} />
    </header>

    <section sel=".main">
      <input sel="#toggle-all.toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul sel=".todo-list">{items.map(({completed, editing, label}, index) =>
        <li class={{editing, completed}}>
          <div sel=".view">
            <input sel=".toggle" type="checkbox" props={{checked: completed}} json={index} action={bindAction<State>({
              change: () => ({currentTarget:{checked:completed, dataset:{json:index}}}) =>
                ({items: splice(index,0,[{completed}])})
            })} />
            <label>{label}</label>
            <button sel=".destroy" json={index} action={bindAction<State>({
              click: () => ({currentTarget:{dataset:{json:index}}}) =>
                ({items: splice(index,1)})
            })}> </button>
          </div>
          <input sel=".edit" value="Create a TodoMVC template" />
        </li>)}
      </ul>
    </section>

    <footer sel=".footer">
      <span sel=".todo-count"><strong>0</strong> item left</span>
      <ul sel=".filters">
        <li>
          <a sel=".selected" href="#/">All</a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      <button sel=".clear-completed">Clear completed</button>
    </footer>
  </section>
