import Pkit, {FC} from '@pkit/snabbdom'

export const SsrLayout: FC<{title: string, state: any}> = ({title, state}, children) =>
  <html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <link href="./css/index.css" rel="stylesheet" />
    <meta name="state" content={encodeURIComponent(JSON.stringify(state))} />
    <script type="module" src="/esm/app/html-pretty-print/client/top/main.js" />
  </head>
  {children}
  </html>
