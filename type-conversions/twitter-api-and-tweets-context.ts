import {
  ITwitterApiMeta,
  ITwitterApiTweet,
  ITwitterApiUser,
  ITwitterApiSearchResult,
} from '../services/twitter'
import { Tweet, User, Meta, SearchReply } from '../generated/proto/twitter_pb'
import { ITweetsContext } from 'components/TweetsContext'

/* First, let's have some type conversions between
   the API response and the Tweets context. These
   will be used in the long-polling implementation.
   */

export const apiToContextTweet = ({
  author_id: authorId,
  created_at: createdAt,
  ...rest
}: ITwitterApiTweet): Tweet.AsObject => {
  return { authorId, createdAt, ...rest }
}

export const apiToContextTweets = (
  tweets: ITwitterApiTweet[],
): Tweet.AsObject[] => tweets.map(apiToContextTweet)

export const contextToApiTweet = ({
  authorId: author_id,
  createdAt: created_at,
  ...rest
}: Tweet.AsObject): ITwitterApiTweet => ({
  author_id,
  created_at,
  ...rest,
})

export const apiToContextUser = ({
  profile_image_url: profileImageUrl,
  ...rest
}: ITwitterApiUser): User.AsObject => ({
  profileImageUrl: profileImageUrl || '',
  ...rest,
})

export const apiToContextUsers = (users: ITwitterApiUser[]): User.AsObject[] =>
  users.map(apiToContextUser)

export const contextToApiMeta = ({
  newestId: newest_id,
  nextToken: next_token,
  oldestId: oldest_id,
  resultCount: result_count,
}: Meta.AsObject): ITwitterApiMeta => ({
  newest_id,
  next_token,
  oldest_id,
  result_count,
})

export const apiToContextMeta = (
  {
    newest_id: newestId,
    next_token: nextToken,
    oldest_id: oldestId,
    result_count: resultCount,
  }: ITwitterApiMeta,
  query?: string,
): Meta.AsObject => ({
  newestId: newestId || '',
  nextToken: nextToken || '',
  oldestId: oldestId || '',
  resultCount: resultCount || 0,
  query: query || '',
})

/* Now, let's move on to conversions between
   API responses and protobuf messages, which
   will be used in the grpc server
   */

export const apiTweetToMessage = (obj: ITwitterApiTweet): Tweet => {
  const tweet = new Tweet()
  tweet.setText(obj.text)
  tweet.setAuthorId(obj.author_id)
  tweet.setCreatedAt(obj.created_at)
  tweet.setId(obj.id)
  return tweet
}

export const apiTweetsToMessage = (obj: ITwitterApiTweet[]): Tweet[] =>
  obj?.map(apiTweetToMessage)

export const apiUserToMessage = (obj: ITwitterApiUser): User => {
  const user = new User()
  user.setId(obj.id)
  user.setName(obj.name)
  obj.profile_image_url && user.setProfileImageUrl(obj.profile_image_url)
  user.setUsername(obj.username)
  return user
}

export const apiUsersToMessage = (obj: ITwitterApiUser[]): User[] =>
  obj?.map(apiUserToMessage)

export const apiMetaToMessage = (
  obj: ITwitterApiMeta,
  query?: string,
): Meta => {
  const meta = new Meta()
  meta.setNewestId(obj?.newest_id || '')
  meta.setNextToken(obj?.next_token || '')
  meta.setOldestId(obj?.oldest_id || '')
  meta.setResultCount(obj?.result_count || 0)
  query && meta.setQuery(query)
  return meta
}

export const apiResponseToGrpcSearchReply = (
  obj: ITwitterApiSearchResult,
  query?: string,
): SearchReply => {
  const searchReply = new SearchReply()
  searchReply.setTweetsList(apiTweetsToMessage(obj.data))
  searchReply.setUsersList(apiUsersToMessage(obj?.includes?.users))
  searchReply.setMeta(apiMetaToMessage(obj.meta, query))
  return searchReply
}

export const searchReplyToContext = (
  searchReply: SearchReply,
): ITweetsContext => {
  return {
    tweets: searchReply.getTweetsList().map(t => t.toObject()),
    users: searchReply.getUsersList().map(u => u.toObject()),
    meta: (searchReply.getMeta() || new Meta()).toObject(),
  }
}
