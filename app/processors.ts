import {Compute, EphemeralBoolean} from "pkit/state";

export type State = {
  editing: string;
  newTodo: string;
  items: {
    editing: boolean;
    completed: boolean;
    label: string;
  }[]
}

export const initial: State = {
  newTodo: 'ほげ',
  editing: '',
  items: [{
    editing: false,
    completed: false,
    label: 'test'
  }]
}

export const compute: Compute<State> = (state) => ({
  ...state
} as State)