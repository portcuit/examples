import {EphemeralBoolean} from "pkit";

export type State = {
  fromHtml: string;
  toHtml: string;
  preventConvert?: EphemeralBoolean
}

export const initialState = () => ({
  fromHtml: `<div>
<p>ここに整形したいHTMLを貼り付けてください。</p><ul>
<li>ローカルのファイルを選択して読み込むことができます。</li>
<li>URLを指定してリモートのHTMLを読み込むことができます。</li></ul>
</div>`,
  toHtml: ''
})