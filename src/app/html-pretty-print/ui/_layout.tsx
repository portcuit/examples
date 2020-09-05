import Pkit, {FC} from '@pkit/snabbdom'

export const SsrLayout: FC = (props, children) =>
  <html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Markdown Converter</title>
    <link href="./css/index.css" rel="stylesheet" />
    <script type="module" src="/esm/app/html-pretty-print/client/top/main.js" />
  </head>
  <body data-state={encodeURIComponent(JSON.stringify(props))}>
  {children}
  </body>
  </html>
