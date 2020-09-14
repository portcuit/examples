import Pkit, {FC, markdown} from '@pkit/snabbdom'
import {action} from '@pkit/snabbdom/csr'
import {State} from "../shared/state";

export const Options: FC<State> = ({options:{fragment,indentInitial, indent}}) =>
  <div class="m-4 text-gray-300 text-xl">
    <h3 class="font-bold text-3xl mb-4">Options</h3>

    <div class="flex leading-relaxed">
      <ul class="mr-8">
        <li>
          <Label>
            <input type="radio" class="form-radio" name="indent" checked={indent === 2} bind={action<State>({
              change: () => () => ({options: {indent: 2}})
            })} />
            <span class="ml-2">Space 2</span>
          </Label>
        </li>
        <li>
          <Label>
            <input type="radio" class="form-radio" name="indent" checked={indent === 4} bind={action<State>({
              change: () => () => ({options: {indent: 4}})
            })} />
            <span class="ml-2">Space 4</span>
          </Label>
        </li>
        <li>
          <Label>
            <input type="radio" class="form-radio" name="indent" checked={indent === "\t"} bind={action<State>({
              change: () => () => ({options: {indent: "\t"}})
            })} />
            <span class="ml-2">Tab</span>
          </Label>
        </li>
      </ul>

      <ul>
        <li>
          <label class="inline-flex items-center">
            <input type="checkbox" class="form-checkbox" checked={fragment} bind={action<State>({
              change: () => ({currentTarget: {checked: fragment}}) => ({options: {fragment}})
            })} />
            <span class="ml-2">Fragment</span>
          </label>
        </li>
        <li>
          <label class="inline-flex items-center">
            <input type="checkbox" class="form-checkbox" checked={indentInitial} bind={action<State>({
              change: () => ({currentTarget: {checked: indentInitial}}) => ({options: {indentInitial}})
            })} />
            <span class="ml-2">indentInitial</span>
          </label>
        </li>
      </ul>

    </div>
  </div>

const Label: FC = (props, children) =>
  <label  class="inline-flex items-center">
    {children}
  </label>