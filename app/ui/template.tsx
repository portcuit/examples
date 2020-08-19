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
      <input sel=".new-todo" placeholder="What needs to be done?" value={newTodo} autofocus detail={items.length} action={bindAction<State, number>({
        keypress: ({key, currentTarget:{value}}) => (key === 'Enter' && value.length > 0) ? ({currentTarget:{value: title},detail:length}) => ({
          newTodo: "",
          items: splice(length, 0, [{editing: false, completed: false, title}])
        }) : undefined
      })} />
    </header>

    <section sel=".main">
      <input sel="#toggle-all.toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul sel=".todo-list">{items.map(({completed, editing, title, focus}, index) =>
        <li class={{editing, completed}} key={index}>
          <div sel=".view">
            <input sel=".toggle" type="checkbox" props={{checked: completed}} detail={index} action={bindAction<State, number>({
              click: () => ({currentTarget:{checked:completed}, detail:index}) => ({
                items: splice(index,0,[{completed}])
              })
            })} />
            <label detail={index} action={bindAction<State, number>({
              dblclick: () => ({detail:index}) => ({
                items: splice(index, 0, [{editing: true, focus: new EphemeralBoolean(false)}])
              }),
            })}>{title}</label>
            <button sel=".destroy" detail={index} action={bindAction<State, number>({
              click: () => ({detail:index}) => ({
                items: splice(index,1)
              })
            })}> </button>
          </div>
          <input sel=".edit" value={title} trigger={{focus}} detail={index} action={bindAction<State, number>({
            blur: () => ({detail:index}) => ({
              items: splice(index, 0, [{editing: false}])
            }),
            keydown: ({key}) => key === 'Escape' ? ({detail: index}) => ({
              items: splice(index, 0, [{editing: false}])
            }) : undefined,
            keypress: ({key}) => key === 'Enter' ? ({currentTarget:{value: title}, detail: index}) => ({
              items: splice(index, 0, [{title, editing: false}])
            }) : undefined
          })} />
        </li>)}
      </ul>
    </section>

    <footer sel=".footer">
      <span sel=".todo-count"><strong>{items.filter(({completed}) => !completed).length}</strong> item left</span>
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
      <button sel=".clear-completed" detail={items.filter(({completed}) => !completed)} action={bindAction<State>({
        click: () => ({detail: items}) => ({
          items: new ReplaceArray(...items)
        })
      })}>Clear completed</button>
    </footer>
  </section>
