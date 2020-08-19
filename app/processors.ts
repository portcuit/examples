import {EphemeralBoolean} from "pkit/state";

export type State = {
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
  items: []
}
