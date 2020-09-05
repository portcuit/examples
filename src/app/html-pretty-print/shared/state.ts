import {EphemeralBoolean} from "pkit";

export type State = {
  fromHtml: string;
  toHtml: string;
  format?: EphemeralBoolean
}

export const initialState = () => ({
  fromHtml: '',
  toHtml: ''
})