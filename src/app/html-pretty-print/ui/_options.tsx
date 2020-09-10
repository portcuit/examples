import {EphemeralBoolean, EphemeralContainer, EphemeralString} from "pkit";
import Pkit, {FC, markdown} from '@pkit/snabbdom'
import {action} from '@pkit/snabbdom/csr'
import {State} from "../shared/state";

export const Options: FC<State> = ({options:{fragment,indentInitial, indent}}) =>
  <div class="m-4 text-gray-300 text-lg">
    <h3 class="font-bold text-3xl mb-4">Options</h3>

    <ul class="flex">
      <li class="mr-4">
        <label>
          <input type="radio" name="indent" checked={indent === 2} bind={action<State>({
            change: () => () => ({options: {indent: 2}})
          })} />
          <span class="pl-2">space-2</span>
        </label>
      </li>
      <li class="mr-4">
        <label>
          <input type="radio" name="indent" checked={indent === 4} bind={action<State>({
            change: () => () => ({options: {indent: 4}})
          })} />
          <span class="pl-2">space-4</span>
        </label>
      </li>
      <li class="mr-4">
        <label>
          <input type="radio" name="indent" checked={indent === "\t"} bind={action<State>({
            change: () => () => ({options: {indent: "\t"}})
          })} />
          <span class="pl-2">tab</span>
        </label>
      </li>
    </ul>

    <ul class="flex">
      <li class="mr-4">
        <label>
          <input type="checkbox" checked={fragment} bind={action<State>({
            change: () => ({currentTarget: {checked: fragment}}) => ({options: {fragment}})
          })} />
          <span class="pl-2">Fragment</span>
        </label>
      </li>
      <li class="mr-4">
        <label>
          <input type="checkbox" checked={indentInitial} bind={action<State>({
            change: () => ({currentTarget: {checked: indentInitial}}) => ({options: {indentInitial}})
          })} />
          <span class="pl-2">indentInitial</span>
        </label>
      </li>
    </ul>
  </div>
