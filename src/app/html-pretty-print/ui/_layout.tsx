import Pkit, {FC} from '@pkit/snabbdom'

export const SsrLayout: FC<{src: string}> = ({src}, children) =>
  <html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Portcuit Examples | TodoMVC</title>
    <link rel="stylesheet" href="./css/base.css" />

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/todomvc-app-css@2.3.0/index.css" />
    <script type="module" src={src} />
  </head>
  <body>
  {children}
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
    <p>Created by <a href="https://github.com/portcuit/examples">Portcuit Examples</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
  </body>
  </html>
