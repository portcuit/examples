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

export const initialState: (...args: any) => State = (appName: string) => ({
  esmAppRoot: `/esm/app/${appName}/ui`,
  endpoint: `/${appName}`,
  fromHtml: `<html lang=ja><head><title>
HTML Pretty Print</title></head><body><h1>
Paste HTML code here.</h1><ul><li>
Also you can load from file or url.</ul></body></html>`,
  toHtml: '',
  options: {
    fragment: false,
    indentInitial: false,
    indent: 2
  },
  downloadFile: '#',
})