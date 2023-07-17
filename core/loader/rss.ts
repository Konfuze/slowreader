import type { Loader } from '../index.js'
import { findLink } from './utils.js'

export const rss: Loader = {
  getMineLinksFromText(text) {
    let links = findLink(text, 'application/rss+xml')
    if (links.length > 0) {
      return links
    } else if (findLink(text, 'application/atom+xml').length === 0) {
      let { origin } = new URL(text.url)
      return [new URL('/feed', origin).href, new URL('/rss', origin).href]
    } else {
      return []
    }
  },

  async getPosts(task, url, text) {
    if (!text) text = await task.text(url)
    let document = text.parse()
    return [...document.querySelectorAll('item')]
      .filter(
        item =>
          item.querySelector('guid')?.textContent ??
          item.querySelector('link')?.textContent
      )
      .map(item => ({
        full: item.querySelector('description')?.textContent ?? undefined,
        id:
          item.querySelector('guid')?.textContent ??
          item.querySelector('link')!.textContent!,
        title: item.querySelector('title')?.textContent ?? undefined,
        url: item.querySelector('link')?.textContent ?? undefined
      }))
  },

  isMineText(text) {
    let document = text.parse()
    if (document.firstChild?.nodeName === 'rss') {
      return document.querySelector('channel > title')?.textContent ?? ''
    } else {
      return false
    }
  },

  isMineUrl() {
    return undefined
  }
}
