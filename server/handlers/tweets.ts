import * as grpc from '@grpc/grpc-js'
import {
  ITweetsServer,
  TweetsService,
} from '../../generated/proto/twitter_grpc_pb'
import {
  Tweet,
  User,
  Meta,
  SearchReply,
  SearchRequest,
} from '../../generated/proto/twitter_pb'

const tweetsHandler: ITweetsServer = {
  unarySearch(
    call: grpc.ServerUnaryCall<SearchRequest, SearchReply>,
    callback: grpc.sendUnaryData<SearchReply>,
  ): void {
    if (call.request) {
      console.log('this is tweetsServer.unarySearch()')

      const tweet = new Tweet()
      tweet.setId('123')
      tweet.setAuthorId('123')
      tweet.setCreatedAt(Date.now().toString())
      tweet.setText('This is a test tweet from my grpc server')
      const tweets = [tweet, tweet]

      const user = new User()
      user.setId('123')
      user.setName('A Very Real Name')
      user.setUsername('tester')
      user.setProfileImageUrl('https://ui-avatars.com/api/?size=32&name=tester')
      const users = [user]

      const meta = new Meta()
      meta.setQuery(call.request.getQuery())
      meta.setResultCount(1)

      const searchReply = new SearchReply()
      searchReply.setMeta(meta)
      searchReply.setTweetsList(tweets)
      searchReply.setUsersList(users)

      // console.log('search reply: ', searchReply.toObject())

      callback(null, searchReply)
    }
  },
  search(call: grpc.ServerWritableStream<SearchRequest, SearchReply>): void {
    console.log('this is tweetsServer.search()')
    const searchReply = new SearchReply()
    const meta = new Meta()
    meta.setQuery(call.request.getQuery())

    searchReply.setMeta(meta)
  },
}

export default {
  service: TweetsService,
  handler: tweetsHandler,
  client: undefined,
}
