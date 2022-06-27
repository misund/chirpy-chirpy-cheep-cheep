import { createContext } from 'react'

/**
 * Tweets Context Interface
 *
 * This interface looks a lot like the Twitter API's responses, with a few
 * notable exceptions: The top level fields are mandatory, and there's an extra
 * meta field for the current query. Also, the 'data' field from Twitter's API
 * has been renamed to 'tweets'.
 *
 * @TODO Consider renaming 'tweets' back to 'data'
 */

export interface ITweetsContext {
  tweets: {
    author_id: string
    created_at: string
    id: string
    text: string
  }[]
  users: {
    id: string
    name: string
    profile_image_url: string
    username: string
  }[]
  meta: {
    query?: string
    newest_id?: string
    next_token?: string
    oldest_id?: string
    result_count?: number
  }
}
const TweetsContext = createContext<ITweetsContext>({
  tweets: [],
  users: [],
  meta: {},
})

export default TweetsContext
