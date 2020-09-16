import {EphemeralBoolean} from "pkit";

export type State = {
  jsAppRoot: string;
  newTodo: string;
  items: {
    editing: boolean;
    completed: boolean;
    title: string;
    focus?: EphemeralBoolean
  }[];
  scope: 'all' | 'active' | 'completed'
}

export const initialState: (...args: any[]) => State = (appName: string) => ({
  jsAppRoot: `/js/app/${appName}/ui`,
  newTodo: '',
  items: [],
  scope: 'all'
})
