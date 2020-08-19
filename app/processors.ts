import {Compute, EphemeralBoolean} from "pkit/state";

export type State = {
  editing: string;
  newTodo: string;
  items: {
    editing: boolean;
    completed: boolean;
    title: string;
    focus?: EphemeralBoolean
  }[]
}

export const initial: State = {
  newTodo: '',
  editing: '',
  items: []
}

export const compute: Compute<State> = (state) => ({
  ...state
} as State)