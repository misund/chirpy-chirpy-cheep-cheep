import * as grpc from '@grpc/grpc-js'
import { apiResponseToGrpcSearchReply } from '../../type-conversions/twitter-api-and-tweets-context'
import {
  ITweetsServer,
  TweetsService,
} from '../../generated/proto/twitter_grpc_pb'
import { SearchReply, SearchRequest } from '../../generated/proto/twitter_pb'
import twitter, { ITwitterApiSearchResult } from '../../services/twitter'

const UPDATE_INTERVAL = 10000

const updateStream = (
  stream: grpc.ServerWritableStream<SearchRequest, SearchReply>,
) => {
  const query = stream.request.getQuery()
  const sinceID = stream.request.getSinceId()
  const listeners = stream.listenerCount('data')
  console.log('listeners', listeners)

  const apiResponseToGrpcSearchReplyWithQuery = (
    obj: ITwitterApiSearchResult,
  ) => apiResponseToGrpcSearchReply(obj, query)

  twitter
    .search(query, sinceID)
    .then(apiResponseToGrpcSearchReplyWithQuery)
    .then(searchReply => {
      console.log('checking in', searchReply.getMeta()?.getResultCount())
      // Don't bother sending empty results over the wire
      if (searchReply.getMeta()?.getResultCount() == 0) {
        console.log(
          'getMeta().getResultCount()',
          searchReply.getMeta()?.getResultCount(),
        )
        throw new Error('no results')
      }

      // For the next call, only ask for newer tweets
      if (searchReply.getMeta()?.getNewestId()) {
        stream.request.setSinceId(searchReply.getMeta()?.getNewestId() || '')
      }

      stream.write(searchReply)
    })
    .catch(err => console.log(err))
}

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

    const id = setInterval(() => updateStream(call), UPDATE_INTERVAL)

    call.on('close', () => {
      clearInterval(id)
    })
    call.on('error', err => console.error(err))
  },
}

export default {
  service: TweetsService,
  handler: tweetsHandler,
}
