import * as grpc from '@grpc/grpc-js'
import { apiResponseToGrpcSearchReply } from '../../type-conversions/twitter-api-and-tweets-context'
import {
  ITweetsServer,
  TweetsService,
} from '../../generated/proto/twitter_grpc_pb'
import {
  Meta,
  SearchReply,
  SearchRequest,
} from '../../generated/proto/twitter_pb'
import twitter from '../../services/twitter'

const tweetsHandler: ITweetsServer = {
  unarySearch(
    call: grpc.ServerUnaryCall<SearchRequest, SearchReply>,
    callback: grpc.sendUnaryData<SearchReply>,
  ): void {
    if (call.request) {
      const query = call.request.getQuery()
      const sinceID = call.request.getSinceId()

      twitter
        .search(query, sinceID)
        .then(apiResponseToGrpcSearchReply)
        .then(reply => callback(null, reply))
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
}
