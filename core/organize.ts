import type { FilterValue } from '@logux/client'
import { atom, computed, onMount } from 'nanostores'

import type { FeedValue } from './feed.js'
import { feedsStore } from './feed.js'

let $list = atom<FilterValue<FeedValue>>({
  isLoading: true
})

onMount($list, () => {
  return feedsStore().subscribe(feeds => {
    $list.set(feeds)
  })
})

export let organizeLoading = computed($list, list => list.isLoading)

export let organizeFeeds = computed($list, list => {
  return list.isLoading ? [] : list.list
})