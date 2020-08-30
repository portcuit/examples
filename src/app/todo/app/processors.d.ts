import { EphemeralBoolean } from "pkit/state";
export declare type State = {
    newTodo: string;
    items: {
        editing: boolean;
        completed: boolean;
        title: string;
        focus?: EphemeralBoolean;
    }[];
    scope: 'all' | 'active' | 'completed';
};
export declare const initial: State;
