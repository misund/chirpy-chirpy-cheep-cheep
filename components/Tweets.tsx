import TweetsContext from './TweetsContext'
import Tweet from './Tweet'

const Tweets = () => (
  <TweetsContext.Consumer>
    {({ tweets, users }) => {
      return tweets.map(({ author_id, text, id }) => {
        const { username, profile_image_url } = users.find(
          user => user.id == author_id,
        ) || { username: 'unknown user' }

        return (
          <Tweet
            key={id}
            screenName={username}
            text={text}
            avatarImg={profile_image_url}
          />
        )
      })
    }}
  </TweetsContext.Consumer>
)

export default Tweets
