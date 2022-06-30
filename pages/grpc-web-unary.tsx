import React from 'react'
import { debounce } from 'debounce'
import TweetsContext, { ITweetsContext } from '../components/TweetsContext'
import Tweets from '../components/Tweets'

import { TweetsClient } from '../generated/proto/twitter_grpc_web_pb'
import { SearchRequest, SearchReply } from '../generated/proto/twitter_pb'
import { RpcError } from 'grpc-web'
import { searchReplyToTweetsContext } from '../utils/type-conversion'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

/**
 * First grpc client
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

  handleChangedQuery(event: { target: { value: string } }) {
    const query = event.target.value

    if (!query || !this.client) {
      return
    }

    const request = new SearchRequest()
    request.setQuery(query)

    this.client?.unarySearch(
      request,
      undefined,
      this.handleSearchReply.bind(this),
    )
  }

  handleSearchReply(err: RpcError, searchReply: SearchReply): void {
    if (err) {
      console.error(err)
      return
    }

    const newContext = searchReplyToTweetsContext(searchReply)
    this.setState(newContext)
  }
}
