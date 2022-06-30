import { createContext } from 'react'
import { Tweet, User, Meta } from '../generated/proto/twitter_pb'

export interface ITweetsContext {
  tweets: Tweet.AsObject[]
  users: User.AsObject[]
  meta: Meta.AsObject
}

const TweetsContext = createContext<ITweetsContext>({
  tweets: [],
  users: [],
  meta: {
    newestId: '',
    nextToken: '',
    oldestId: '',
    query: '',
    resultCount: 0,
  },
})

export default TweetsContext
