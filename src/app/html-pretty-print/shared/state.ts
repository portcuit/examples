import {EphemeralBoolean, EphemeralContainer, EphemeralString} from "pkit";

export type State = {
  fromHtml: string;
  toHtml: string;
  preventConvert?: EphemeralBoolean;
  files?: EphemeralContainer<FileList>;
  copy?: EphemeralBoolean;
  options: {
    fragment: boolean,
    indentInitial: boolean,
    indent: number | string
  },
  downloadFile: string;
  debug?: void | Object;
  url?: string;
}

export const initialState: () => State = () => ({
  fromHtml: `<html lang="ja"><head><title>HTML Pretty Print</title></head><body>
<h1>ここに整形したいHTMLを貼り付けてください。</h1><ul>
<li>PCに保存されているHTMLファイルを読み込むことができます。</li>
<li>URLを指定してリモートのHTMLを読み込むことができます。</li></ul></body></html>`,
  toHtml: '',
  options: {
    fragment: false,
    indentInitial: false,
    indent: 2
  },
  downloadFile: '#',
})