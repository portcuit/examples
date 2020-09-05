import {EphemeralBoolean} from "pkit";

export type State = {
  fromHtml: string;
  toHtml: string;
  preventConvert?: EphemeralBoolean
}

export const initialState = () => ({
  fromHtml: `<article>
<h1>ここに整形したいHTMLを貼り付けてください。</h1><ul>
<li>PCに保存されているHTMLファイルを読み込むことができます。</li>
<li>URLを指定してリモートのHTMLを読み込むことができます。</li></ul></article>`,
  toHtml: ''
})