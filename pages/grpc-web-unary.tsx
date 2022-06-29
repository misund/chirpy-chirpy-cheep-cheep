import React from 'react'
import { debounce } from 'debounce'
import TweetsContext, { ITweetsContext } from '../components/TweetsContext'
import Tweets from '../components/Tweets'

import { TweetsClient } from '../generated/proto/twitter_grpc_web_pb'
import { SearchRequest, SearchReply, User } from '../generated/proto/twitter_pb'
import { RpcError } from 'grpc-web'

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
      meta: { query: '' },
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
  componentWillUnmount() {
    // @TODO clean up subscriptions
  }

  handleChangedQuery(event: { target: { value: string } }) {
    const query = event.target.value

    if (!query && !this.client) {
      return
    }

    // @TODO clean up subscriptions
    // @TODO remove existing tweets from context
    const request = new SearchRequest()
    request.setQuery(query)

    this.client?.unarySearch(
      request,
      undefined,
      this.handleSearchReply.bind(this),
    )

    /*
    fetchData(query)
      .then(this.updateContext.bind(null, query))
      .catch(err => console.error(err))
    */
  }

  handleSearchReply(err: RpcError, searchReply: SearchReply): void {
    if (err) {
      console.error(err)
      return
    }

    const {
      meta,
      tweetsList: tweets,
      usersList: users,
    } = searchReply.toObject()

    this.updateContext(meta?.query || 'unknown query', {
      data: tweets,
      users,
      meta,
    })
  }

  updateContext(
    query: string,
    json: { data: any; users?: User.AsObject[]; meta: Meta.AsObject },
  ) {
    if (json?.meta?.resultCount > 0) {
      this.setState(({ tweets, users, meta }) => {
        // clear tweets if the query is different
        const ts = meta.query === query ? tweets : []

        const newContext = {
          tweets: (json.data || []).concat(ts),
          users: users.concat(json.users || []),
          meta: {
            ...meta,
            query: query,
            ...json.meta,
          },
        }

        return newContext
      })
    } else {
      console.log('no results')
    }

    return json
  }
}
