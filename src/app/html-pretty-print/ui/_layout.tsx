import Pkit, {FC} from '@pkit/snabbdom'

export const SsrLayout: FC = (props, children) =>
  <html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HTML Pretty Print - HTML 整形</title>
    <link href="./css/index.css" rel="stylesheet" />
    <meta name="state" content={encodeURIComponent(JSON.stringify(props))} />
    <script type="module" src="/esm/app/html-pretty-print/client/top/main.js" />
  </head>
  {children}
  </html>
