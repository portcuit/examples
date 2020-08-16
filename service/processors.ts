import {Compute} from "pkit/state";

export type State = {
  msg: string;
}

export const compute: Compute<State> = (state) => ({
  ...state
} as State)