import {EphemeralBoolean, EphemeralContainer} from "pkit";
import Pkit, {FC, markdown} from '@pkit/snabbdom'
import {action} from '@pkit/snabbdom/csr/processors'
import {SsrLayout} from './_layout'
import {State} from "../shared/state";

const Converter: FC<State> = ({fromHtml, toHtml, copy}) =>
  <div class="flex mt-10">
    <div class="w-1/2 p-4">
      <div class="flex mb-2">
        <label class="w-1/2 mr-1 p-2 bg-gray-800 hover:bg-gray-700 text-center text-white font-semibold cursor-pointer">
          ファイルから読み込み
          <input type="file" class="hidden" bind={action<State>({
            change: () => ({currentTarget: {files}}) => ({files: new EphemeralContainer(files)})
          })} />
        </label>
        <button class="w-1/2 ml-1 p-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold">URLから読み込み</button>
      </div>
      <textarea class="w-full h-screen-1/2 p-4" placeholder="ここに整形したいHTMLを貼り付けてください。" bind={action<State>({
        keyup: ({key}) => key === 'Enter' ? ({currentTarget: {value: fromHtml}}) => ({fromHtml}) : undefined,
        change: () => ({currentTarget: {value: fromHtml}}) => ({fromHtml})
      })} value={fromHtml} />
    </div>
    <div class="w-1/2 p-4">
      <textarea class="w-full h-screen-1/2 p-4 bg-gray-800 text-white" wrap="off" readOnly={true} value={toHtml} trigger={{copy}} />
      <div class="flex mt-2">
        <button class="w-1/2 p-2 mr-1 bg-white hover:bg-gray-300 font-semibold" bind={action<State>({
          click: () => () => ({copy: new EphemeralBoolean(true)})
        })}>コピー</button>
        <button class="w-1/2 p-2 ml-1 bg-white hover:bg-gray-300 font-semibold">
          <svg class="inline-block fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>ダウンロード</span>
        </button>
      </div>
    </div>
  </div>

const Options: FC<State> = ({options:{fragment,indentInitial, indent}}) =>
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

export const Index: FC<State> = (state) =>
  <body class="bg-gray-900">
  <div class="container mx-auto my-8">
    <h1 class="text-white font-bold text-6xl text-center m-auth">HTML Pretty Print</h1>
    <h2 class="text-gray-700 text-2xl text-center">HTMLを整えて表示します</h2>

    <Converter {...state} />
    <Options {...state} />

    {markdown`
- ToDo
    - UTF-8以外の文字コードに対応
`}
  </div>
  </body>


export const Ssr: FC<State> = (state) =>
  <SsrLayout {...state}>
    <Index {...state} />
  </SsrLayout>
