const isServer = typeof window === 'undefined'
/**
 * Next Server URL
 *
 * @TODO Move this value to .env or load conditionally, so we won't have to
 * import the port number from server/next. That's not isomorphic.
 */
const NEXT_SERVER_URL = isServer ? `http://localhost:3000` : ''
const API_URL = `${NEXT_SERVER_URL}/api/twitter/2/`

export interface ITwitterApiTweet {
  author_id: string
  created_at: string
  id: string
  text: string
}

export interface ITwitterApiUser {
  id: string
  name: string
  profile_image_url?: string
  username: string
}

export interface ITwitterApiMeta {
  newest_id?: string
  next_token?: string
  oldest_id?: string
  result_count?: number
}

export interface ITwitterApiSearchResult {
  data: ITwitterApiTweet[]
  includes: { users: ITwitterApiUser[] }
  meta: ITwitterApiMeta
}

function search(
  query: string,
  since_id?: string,
): Promise<ITwitterApiSearchResult> {
  const url =
    `${API_URL}tweets/search/recent` +
    '?tweet.fields=created_at' +
    '&user.fields=profile_image_url' +
    '&expansions=author_id' +
    `&query=${encodeURIComponent(query)}` +
    `${(since_id && `&since_id=${encodeURIComponent(since_id)}`) || ''}`

  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err))
}

export default {
  search,
}
