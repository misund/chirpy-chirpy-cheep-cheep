import React from 'react'
import { debounce } from 'debounce'
import TweetsContext, { ITweetsContext } from '../components/TweetsContext'
import Tweets from '../components/Tweets'
import twitter, { ITwitterApiSearchResult } from '../services/twitter'
import {
  apiToContextMeta,
  apiToContextTweets,
  apiToContextUsers,
} from '../utils/type-conversion'

const UPDATE_FREQUENCY = 10000

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

/**
 * Long Polling Implementation
 *
 * Edge cases that are not handled include:
 * - Getting older tweets than the 10 most recent at the first payload
 * - Getting all tweets if there are more than 10 new tweets during one update
 *   interval
 *
 * Both of these cases can be easily handled using the next_token parameter,
 * but I will prioritize other tasks.
 */
export default class LongPolling extends React.Component<
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

  timerID?: NodeJS.Timeout = undefined

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
        </div>

        <Tweets />
      </TweetsContext.Provider>
    )
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.updateTweets(), UPDATE_FREQUENCY)
  }
  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  handleChangedQuery(event: { target: { value: string } }) {
    const query = event.target.value

    if (!query) {
      return
    }

    twitter
      .search(query)
      .then(this.updateContext.bind(null, query))
      .catch(err => console.error(err))
  }

  updateTweets() {
    const { query, newestId } = this.state.meta

    if (!query || !newestId) {
      console.warn("No query or newest id, can't update tweets")
      return
    }

    twitter
      .search(query, newestId)
      .then(this.updateContext.bind(null, query))
      .catch(err => console.error(err))
  }

  updateContext = (query: string, json: ITwitterApiSearchResult) => {
    if (json.meta.result_count) {
      this.setState(({ tweets, users, meta }) => {
        // clear tweets if the query is different
        const ts = meta.query === query ? tweets : []

        const newContext = {
          tweets: apiToContextTweets(json.data || []).concat(ts),
          users: users.concat(apiToContextUsers(json.includes?.users)),
          meta: {
            ...meta,
            ...apiToContextMeta(json.meta, query),
          },
        }

        return newContext
      })
    }

    return json
  }
}
