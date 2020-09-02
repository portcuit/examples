import {EphemeralBoolean} from "pkit";

export type State = {
  newTodo: string;
  items: {
    editing: boolean;
    completed: boolean;
    title: string;
    focus?: EphemeralBoolean
  }[];
  scope: 'all' | 'active' | 'completed'
}

export const initial: State = {
  newTodo: '',
  items: [],
  scope: 'all'
}
