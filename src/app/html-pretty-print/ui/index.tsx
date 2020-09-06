import {EphemeralContainer} from "pkit";
import Pkit, {FC, markdown} from '@pkit/snabbdom'
import {action} from '@pkit/snabbdom/csr/processors'
import {SsrLayout} from './_layout'
import {State} from "../shared/state";

export const Index: FC<State> = ({fromHtml, toHtml}) =>
  <div class="bg-gray-900 h-screen flex">
    <div class="w-1/2 p-4">
      <div class="flex">
        <label class="bt-gray-300 p-2 m-2 bg-gray-300">
          ファイルから読み込み
          <input type="file" class="hidden" bind={action<State>({
            change: () => ({currentTarget: {files}}) => ({
              files: new EphemeralContainer(files)
            })
          })} />
        </label>
        <button class="bt-gray-300 p-2 m-2 bg-gray-300">URLから読み込み</button>
      </div>
      <textarea class="w-full h-64 p-4" placeholder="ここに整形したいHTMLを貼り付けてください。" bind={action<State>({
        keyup: ({key}) => key === 'Enter' ? ({currentTarget: {value: fromHtml}}) => ({fromHtml}) : undefined,
        change: () => ({currentTarget: {value: fromHtml}}) => ({fromHtml})
      })} value={fromHtml} />
    </div>
    <div class="w-1/2 p-4">
      <textarea class="w-full h-64 p-4 bg-gray-800 text-white" wrap="off" readOnly={true} value={toHtml} />
      <div class="flex">
        <button class="bt-gray-300 p-2 m-2 bg-gray-300">コピー</button>
        <button class="bt-gray-300 p-2 m-2 bg-gray-300">ダウンロード</button>
      </div>
    </div>
  </div>

export const Ssr: FC<State> = (state) =>
  <SsrLayout {...state}>
    <Index {...state} />
    {markdown`
- ToDo
    - UTF-8以外の文字コードに対応
`}
  </SsrLayout>
