import Pkit, {FC} from '@pkit/snabbdom'

export const ServerLayout: FC<{src: string}> = ({src}) =>
  <html lang="ja">
  <head>
    <title>TodoMVC | portcuit examples</title>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/todomvc-common@1.0.5/base.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/todomvc-app-css@2.3.0/index.css" />
    <script type="module" src={src} />
  </head>
  <body>
  <main>
  </main>
  </body>
  </html>
