import {EphemeralBoolean, EphemeralContainer} from "pkit";

export type State = {
  url?: URL;
  esmAppRoot: string;
  endpoint: string;
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
  loadUrl?: string;
}

const appName = __dirname.split('/').reverse()[1];

export const initialState: () => State = () => ({
  esmAppRoot: `/esm/app/${appName}/ui`,
  endpoint: `/${appName}`,
  fromHtml: `<html lang=ja><head><title>HTML Pretty Print</title></head><body>
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