import {html} from '@pkit/snabbdom'
import {State} from "../processors";

export const LayoutTpl = ({msg}: State) =>
  <div>
    <p>{msg}</p>
    <p>ほげもがもげあ</p>
    <input on={{change: (ev) => {ev}}} />
  </div>
