import {DeepPartial} from "pkit/core";

export type State = {
  msg: string;
}

export const compute = (state: DeepPartial<State>) => ({
  ...state
})