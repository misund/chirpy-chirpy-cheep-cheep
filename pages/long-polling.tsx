import React from 'react'
import { debounce } from 'debounce'
import TweetsContext, { ITweetsContext } from '../components/TweetsContext'
import Tweets from '../components/Tweets'

const API_URL = '/api/twitter/2/'
const UPDATE_FREQUENCY = 30000

function fetchData(query: string, since_id?: string) {
  const url =
    `${API_URL}tweets/search/recent` +
    '?tweet.fields=created_at' +
    '&user.fields=profile_image_url' +
    '&expansions=author_id' +
    `&query=${query}` +
    `${(since_id && `&since_id=${since_id}`) || ''}`

  // console.log('outgoing request', url)

  return fetch(url)
    .then(res => res.json())
    .catch(err => console.error(err))
}

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
      meta: { query: '' },
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

    fetchData(query)
      .then(this.updateContext.bind(null, query))
      .catch(err => console.error(err))
  }

  updateTweets() {
    const { query, newest_id } = this.state.meta

    if (!query || !newest_id) {
      console.warn("No query or newest id, can't update tweets")
      return
    }

    fetchData(query, newest_id)
      .then(this.updateContext.bind(null, query))
      .catch(err => console.error(err))
  }

  updateContext = (query: string, json: any) => {
    if (json.meta.result_count > 0) {
      this.setState(({ tweets, users, meta }) => {
        // clear tweets if the query is different
        const ts = meta.query === query ? tweets : []

        const newContext = {
          tweets: (json.data || []).concat(ts),
          users: users.concat(json.includes?.users || []),
          meta: {
            ...meta,
            query: query,
            ...json.meta,
          },
        }

        return newContext
      })
    }

    return json
  }
}
