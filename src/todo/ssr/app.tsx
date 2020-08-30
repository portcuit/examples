import Pkit, {FC} from '@pkit/snabbdom'

export const App: FC<{src: string}> = ({src}) =>
  <Layout>
  <head>
    <title>{src}</title>
    <meta charset="UTF-8" />
    <script type="module" src={src}>
    </script>
  </head>
  <body>
  <main>
  </main>
  </body>
  </Layout>

export const Layout: FC = (_, children) =>
  <html lang="ja">
  {children}
  </html>
