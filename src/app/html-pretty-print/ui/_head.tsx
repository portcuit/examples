import Pkit, {FC} from '@pkit/snabbdom'

export const Head: FC = (props, children) =>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link href="./css/index.css" rel="stylesheet" />
    {children}
  </head>