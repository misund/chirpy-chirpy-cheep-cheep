import TweetsContext from './TweetsContext'
import Tweet from './Tweet'

const Tweets = () => (
  <TweetsContext.Consumer>
    {({ tweets, users }) => {
      return tweets.map(({ authorId, id, ...rest }) => {
        const { username, name, profileImageUrl } = users.find(
          user => user.id == authorId,
        ) || { username: 'unknown user' }

        return (
          <Tweet
            key={id}
            screenName={username}
            avatarImg={profileImageUrl}
            name={name}
            {...rest}
          />
        )
      })
    }}
  </TweetsContext.Consumer>
)

export default Tweets
