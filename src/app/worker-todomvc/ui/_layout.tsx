import Pkit, {FC} from '@pkit/snabbdom'

export const SsrLayout: FC<{src: string}> = ({src}, children) =>
  <html lang="ja">
  <head>
    <title>TodoMVC | portcuit examples</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/todomvc-app-css@2.3.0/index.css" />
    <script type="module" src={src} />
  </head>
  <body>
  {children}
  <footer sel=".info">
    <p>Double-click to edit a todo</p>
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <p>Created by <a href="https://github.com/portcuit/examples">Portcuit Examples</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
  </body>
  </html>
