import Pkit, {FC} from '@pkit/snabbdom'
import {action} from '@pkit/snabbdom/csr/processors'
import {SsrLayout} from './_layout'
import {State} from "../shared/state";
import {EphemeralBoolean} from "pkit";

export const Index: FC<State> = ({fromHtml, toHtml}) =>
  <div class="bg-gray-900 h-screen flex">
    <div class="w-1/2 p-4">
      <div class="flex">
        <label class="bt-gray-300 p-2 m-2 bg-gray-300">
          ファイルから読み込み
          <input type="file" class="hidden" />
        </label>
        <button class="bt-gray-300 p-2 m-2 bg-gray-300">URLから読み込み</button>
      </div>
      <textarea class="w-full h-64 p-4" placeholder="ここに整形したいHTMLを貼り付けてください。" bind={action<State>({
        keyup: ({key}) => key === 'Enter' ? ({currentTarget: {value: fromHtml}}) => ({fromHtml}) : undefined,
        change: () => ({currentTarget: {value: fromHtml}}) => ({fromHtml})
      })} value={fromHtml} />
    </div>
    <div class="w-1/2 p-4">
      <textarea class="w-full h-64 p-4 bg-gray-800 text-white" readOnly={true} value={toHtml} />
    </div>
  </div>

export const Ssr: FC<State> = (state) =>
  <SsrLayout {...state}>
    <Index {...state} />
  </SsrLayout>
