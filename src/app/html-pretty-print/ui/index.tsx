import {EphemeralBoolean, EphemeralContainer} from "pkit";
import Pkit, {FC, markdown} from '@pkit/snabbdom'
import {action} from '@pkit/snabbdom/csr'
import {Head} from './_head'
import {Options} from './_options'
import {State} from "../shared/state";
import {RequestArgs} from "pkit/http/server";
import client from '../client/'

const Converter: FC<State> = ({fromHtml, toHtml, copy, downloadFile}) =>
  <div class="flex mt-10">
    <div class="w-1/2 p-4">
      <div class="flex mb-2">
        <label class="w-1/2 mr-1 p-2 bg-gray-800 hover:bg-gray-700 text-center text-white font-semibold cursor-pointer">
          File
          <input type="file" class="hidden" bind={action<State>({
            change: () => ({currentTarget: {files}}) => ({files: new EphemeralContainer(files)})
          })} />
        </label>
        <button class="w-1/2 ml-1 p-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold" bind={action<State>({
          click: ({currentTarget}) =>
            (currentTarget.dataset.url = prompt('Please enter the URL.')!) ?
              ({currentTarget:{dataset:{url}}}) => ({loadUrl:url}) : undefined
        })}>URL</button>
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
        })}>Copy</button>
        <a href={downloadFile} download="pretty.html" class="w-1/2 p-2 ml-1 bg-white hover:bg-gray-300 text-center font-semibold">
          <svg class="inline-block fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
          <span>Download</span>
        </a>
      </div>
    </div>
  </div>

const Body: FC<State> = (state) =>
  <body class="bg-gray-900">
  <div class="mx-auto my-8 px-8">
    <h1 class="text-white font-bold text-6xl text-center m-auth">HTML Pretty Print</h1>
    <h2 class="text-gray-700 text-2xl text-center">Load from File and URL supports multiple charset.</h2>

    <Converter {...state} />
    <Options {...state} />

    <p>see source</p>
  </div>
  </body>

const Html: FC<State> = (state) =>
  <html lang="ja">
  <Head>
    <title>HTML Pretty Print</title>
    <script id="state" type="application/json" innerHTML={JSON.stringify(state)} />
    <script type="module" src={`${state.esmAppRoot}/main.js`} />
  </Head>
  <Body {...state} />
  </html>

export const ssr = (requestArgs: RequestArgs) => {
  const {ssr} = require('../server/');
  return {...ssr, params: {requestArgs, Html}}
}

export const ssg = (fileName: string) => {
  const {ssg} = require('../server/');
  return {...ssg, params: {fileName, Html}}
}

export const csr = () => {
  return {...client, params: Body}
}