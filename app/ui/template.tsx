import {injectGlobal} from 'emotion'
import {jsx} from 'snabbdom/jsx'
import {EphemeralBoolean, splice, ReplaceArray} from "pkit/state";
import {State} from "../processors";
import {bindAction} from "@pkit/snabbdom";

injectGlobal`
  @import url("https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css");
  @import url("https://cdn.jsdelivr.net/npm/todomvc-app-css@2.3.0/index.css");
`

export const LayoutTpl = ({newTodo, items}: State) =>
  <section sel=".todoapp" dataset={{hoge: "huga"}} detail={true}>
    <header sel=".header">
      <h1>todos</h1>
      <input sel=".new-todo" placeholder="What needs to be done?" value={newTodo} autofocus detail={items.length} action={bindAction<State,number>({
        keypress: ({key, currentTarget:{value}}) => (key === 'Enter' && value.length > 0) ? ({currentTarget:{value:label},detail:length}) => ({
          newTodo: "",
          items: splice(length, 0, [{editing: false, completed: false, label}])
        }) : undefined
      })} />
    </header>

    <section sel=".main">
      <input sel="#toggle-all.toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul sel=".todo-list">{items.map(({completed, editing, label}, index) =>
        <li class={{editing, completed}}>
          <div sel=".view" detail={index} action={bindAction<State>({
            dblclick: () => ({detail:index}) => ({
              items: splice(index, 0, [{editing: true}])
            })
          })}>
            <input sel=".toggle" type="checkbox" props={{checked: completed}} detail={index} action={bindAction<State, number>({
              change: () => ({currentTarget:{checked:completed}, detail:index}) => ({items: splice(index,0,[{completed}]),})
            })} />
            <label>{label}</label>
            <button sel=".destroy" detail={index} action={bindAction<State, number>({
              click: () => ({detail:index}) =>
                ({items: splice(index,1)})
            })}> </button>
          </div>
          <input sel=".edit" value={label} />
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
