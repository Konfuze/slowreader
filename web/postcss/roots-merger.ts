// PostCSS plugin for ../script/clean-css.ts to merge all rules
// with :root selector into the single rule in the beginning of the file

import { rule } from 'postcss'
import type { ChildNode, Plugin, Rule } from 'postcss'

export const rootsMerger: Plugin = {
  postcssPlugin: 'roots-merger',
  prepare() {
    let rootNodes = new Map<string, ChildNode>()
    let rulesToRemove: Rule[] = []

    return {
      OnceExit(root) {
        rulesToRemove.forEach(cssRule => cssRule.remove())

        let rootRule = rule({ selector: ':root' })

        rootRule.append(...rootNodes.values())
        if (rootRule.nodes.length > 0) {
          root.prepend(rootRule)
        }
      },
      Rule(cssRule) {
        if (cssRule.selector !== ':root') {
          return
        }

        if (cssRule.parent?.type === 'atrule') {
          return
        }

        cssRule.walkDecls(decl => {
          // remove rule from the map to preserve the rules order
          if (rootNodes.has(decl.prop)) {
            rootNodes.delete(decl.prop)
          }

          rootNodes.set(decl.prop, decl)
        })

        rulesToRemove.push(cssRule)
      }
    }
  }
}
