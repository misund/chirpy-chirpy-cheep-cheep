import { ITweetsContext } from '../components/TweetsContext'

const API_URL = '/api/twitter/2/'

function search(query: string, since_id?: string): Promise<ITweetsContext> {
  const url =
    `${API_URL}tweets/search/recent` +
    '?tweet.fields=created_at' +
    '&user.fields=profile_image_url' +
    '&expansions=author_id' +
    `&query=${query}` +
    `${(since_id && `&since_id=${since_id}`) || ''}`

  // console.log('outgoing request', url)

  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err))
}

export default {
  search,
}
