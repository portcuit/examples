import unified from 'unified'
import parse from 'remark-parse'
import frontmatter from 'remark-frontmatter'
import vdom from 'remark-vdom'
import YAML from 'yaml'
import {h} from '@pkit/snabbdom/lib/h'
import {VNode} from "snabbdom/jsx-global";

type Token = {type: string, value: string}

export const md2vdom = async (md: string) => {
  let tokens = [] as Token[];
  let meta = {};
  const file = await unified()
    .use(parse)
    .use(vdom, {h})
    .use(frontmatter, ['yaml'] as any)
    .use(() =>
      (data) => {
        tokens = data.children as Token[]
      })
    .process(md);

  if (tokens.length > 0 && tokens[0].type === 'yaml') {
    meta = YAML.parse(tokens[0].value);
  }

  return {
    meta,
    children: (file.result as any).children as VNode[]
  }
}

