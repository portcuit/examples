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
      <textarea class="w-full h-64" placeholder="ここに整形したいHTMLを貼り付けてください。" bind={action<State>({
        change: () => ({currentTarget: {value: fromHtml}}) => ({fromHtml})
      })}>{fromHtml}</textarea>
      <button class="w-full p-2 m-2 bg-blue-200" bind={action<State>({
        click: () => () => ({format: new EphemeralBoolean(true)})
      })}>整形する</button>
    </div>
    <div class="w-1/2 p-4">
      <textarea class="w-full h-64 bg-gray-800 text-white" readonly>{toHtml}</textarea>
    </div>
  </div>

export const Ssr: FC<State> = (state) =>
  <SsrLayout {...state}>
    <Index {...state} />
  </SsrLayout>
