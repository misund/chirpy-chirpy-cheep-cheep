import { createContext } from 'react'

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
