import React from 'react'
import { debounce } from 'debounce'
import TweetsContext, { ITweetsContext } from '../components/TweetsContext'
import Tweets from '../components/Tweets'

import { TweetsClient } from '../generated/proto/twitter_grpc_web_pb'
import { SearchRequest, SearchReply } from '../generated/proto/twitter_pb'
import { RpcError, ClientReadableStream } from 'grpc-web'
import { searchReplyToContext } from '../type-conversions/twitter-api-and-tweets-context'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

/**
 * Streaming grpc client
 */
export default class GrpcTweets extends React.Component<
  IProps,
  ITweetsContext
> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      tweets: [],
      meta: {
        query: '',
        newestId: '',
        nextToken: '',
        oldestId: '',
        resultCount: 0,
      },
      users: [],
    }
  }

  client?: TweetsClient = undefined
  stream?: ClientReadableStream<SearchReply> = undefined

  render() {
    const { tweets, meta, users } = this.state

    return (
      <TweetsContext.Provider value={{ tweets, meta, users }}>
        <div className="search">
          <input
            placeholder="Type your search query here"
            onChange={debounce(
              (e: { target: { value: string } }) => this.handleChangedQuery(e),
              500,
            )}
          ></input>
          <div>counter: {tweets.length}</div>
        </div>

        <Tweets />
      </TweetsContext.Provider>
    )
  }

  componentDidMount() {
    this.client = new TweetsClient(`http://${window.location.hostname}:8080`)
  }
  componentWillUnmount() {
    // clean up subscriptions for the old query
    if (this.stream) {
      this.stream?.cancel()
    }
  }

  handleChangedQuery(event: { target: { value: string } }) {
    const query = event.target.value

    if (!query || !this.client) {
      return
    }

    // clean up subscriptions for the old query
    if (this.stream) {
      this.stream?.cancel()
    }

    // clear tweets since the query is different
    this.setState({ tweets: [] })

    const request = new SearchRequest()
    request.setQuery(query)

    this.stream = this.client?.search(request)

    this.stream.on('data', searchReply => {
      const newContextContent = searchReplyToContext(searchReply)

      this.setState(({ users, tweets }) => ({
        meta: newContextContent.meta,
        tweets: newContextContent.tweets.concat(tweets),
        users: newContextContent.users.concat(users),
      }))
    })

    this.stream.on('error', (err: RpcError) => {
      console.error(err)
    })
  }
}
