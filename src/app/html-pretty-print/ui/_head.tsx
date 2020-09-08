import Pkit, {FC} from '@pkit/snabbdom'
import {State} from "../shared/state";

export const Head: FC<State> = (state, children) =>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{state.title}</title>
    <link href="./css/index.css" rel="stylesheet" />
    <meta name="state" content={encodeURIComponent(JSON.stringify(state))} />
    <script type="module" src="/esm/app/html-pretty-print/client/top/main.js" />
    {children}
  </head>