import {jsx} from 'snabbdom/jsx'
import {State} from "../processors";
import {createAction} from "@pkit/snabbdom";


export const LayoutTpl = ({msg}: State) =>
  <div>
    <p>{msg}</p>
    <p>ほげもがもげあ</p>
    <input action={createAction<State>({
      change: () => ({currentTarget:{value}}) => ({
        msg: `Hello ${value} world.`
      })
    })} />
  </div>
