import {EphemeralBoolean, EphemeralContainer} from "pkit";
import Pkit, {FC} from '@pkit/snabbdom'
import {action} from '@pkit/snabbdom/csr'
import {Head} from './_head'
import {Options} from './_options'
import {State} from "../shared/state";
import {csr} from '../client/'
import {CreateSsg, CreateSsr} from "../../shared/server/render";
import {ssr, ssg} from '../server/'
import {CreateCsr} from "../../shared/client/vm";

const Converter: FC<State> = ({fromHtml, toHtml, copy, downloadFile}) =>
  <div class="flex flex-col lg:flex-row mt-10">
    <div class="flex-1 w-full p-4">
      <div class="flex mb-2">
        <label class="w-1/2 mr-1 p-2 bg-gray-800 hover:bg-gray-700 text-center text-white font-semibold cursor-pointer">
          <SvgContainer>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clip-rule="evenodd" />
              <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
            </svg>
          </SvgContainer>
          <span>File</span>
          <input type="file" class="hidden" bind={action<State>({
            change: () => ({currentTarget: {files}}) => ({files: new EphemeralContainer(files)})
          })} />
        </label>
        <button class="w-1/2 ml-1 p-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold" bind={action<State>({
          click: ({currentTarget}) =>
            (currentTarget.dataset.url = prompt('Please enter the URL.')!) ?
              ({currentTarget:{dataset:{url}}}) => ({loadUrl:url}) : undefined
        })}>
          <SvgContainer>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z" clip-rule="evenodd" />
            </svg>
          </SvgContainer>
          <span>URL</span>
        </button>
      </div>
      <textarea class="w-full h-screen-1/2 p-4" placeholder="ここに整形したいHTMLを貼り付けてください。" bind={action<State>({
        paste: (ev) => {
          ev.currentTarget.dataset.html = ev.clipboardData!.getData('text');
          return ({currentTarget: {dataset: {html: fromHtml}}}) => ({fromHtml});
        },
        change: () => ({currentTarget: {value: fromHtml}}) => ({fromHtml})
      })} value={fromHtml} />
    </div>
    <div class="flex-1 w-rull p-4">
      <textarea class="w-full h-screen-1/2 p-4 bg-gray-800 text-white" wrap="off" readOnly={true} value={toHtml} trigger={{copy}} />
      <div class="flex mt-2">
        <button class="w-1/2 p-2 mr-1 bg-white hover:bg-gray-300 font-semibold" bind={action<State>({
          click: () => () => ({copy: new EphemeralBoolean(true)})
        })}>
          <SvgContainer>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </SvgContainer>
          <span>Copy</span>
        </button>
        <a href={downloadFile} download="pretty.html" class="w-1/2 p-2 ml-1 bg-white hover:bg-gray-300 text-center font-semibold">
          <SvgContainer>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </SvgContainer>
          <span>Download</span>
        </a>
      </div>
    </div>
  </div>

const SvgContainer: FC = (props, children) =>
  <span class="inline-block align-middle fill-current w-5 h-5 mr-2">{children}</span>


const Body: FC<State> = (state) =>
  <body class="bg-gray-900">
  <div class="container mx-auto mt-8">
    <h1 class="text-white font-bold text-6xl text-center m-auth">HTML Pretty Print</h1>
    <h2 class="text-gray-700 text-2xl text-center">
      A tool to convert ugly HTML code to pretty format. <br/>
      It can load from file and URL that supports multiple charset.
    </h2>
  </div>
  <div class="mx-auto my-8 px-8">
    <Converter {...state} />
  </div>
  <div class="container mx-auto">
    <Options {...state} />
  </div>

  <p class="container mx-auto text-gray-700 text-center mt-10 mb-16">
    <span>Part of </span>
    <a class="text-gray-500 underline hover:text-gray-300" href="https://github.com/portcuit/examples">Portcuit examples.</a>
  </p>

  </body>

const Html: FC<State> = (state) =>
  <html lang="ja">
  <Head>
    <title>HTML Pretty Print</title>
    <script id="state" type="application/json" innerHTML={JSON.stringify(state)} />
    <script type="module" src={`${state.esmAppRoot}/main.js`} defer />
  </Head>
  <Body {...state} />
  </html>

export const createSsr: CreateSsr<State> = (requestArgs) =>
  ({...ssr, params: {requestArgs, Html}})

export const createSsg: CreateSsg<State> = (...info) =>
  ({...ssg, params: {info, Html}})

export const createCsr: CreateCsr<State> = () =>
  ({...csr, params: Body})
