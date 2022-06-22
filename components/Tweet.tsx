import React from 'react'
import styled from 'styled-components'

const TweetBox = styled.div`
  border: 1px solid #eee;
`

type TweetProps = {
  screenName: string
  avatarImg?: string
  text: string
}

const Img = styled.img`
  display: inline-block;
  margin: 3px;
  width: 32px;
  height: 32px;
`
const TextBlock = styled.div`
  display: inline-block;
`
const ScreenName = styled.div`
  font-size: 12px;
  color: #666;
`
const Text = styled.div`
  color: #333;
`

const Tweet = ({ screenName, avatarImg = '', text }: TweetProps) => {
  const avatarSrc = avatarImg
    ? avatarImg
    : `https://ui-avatars.com/api/?size=32&name=${screenName}`

  return (
    <TweetBox>
      <Img src={avatarSrc} alt={screenName} />
      <TextBlock>
        <ScreenName>{screenName}</ScreenName>
        <Text>{text}</Text>
      </TextBlock>
    </TweetBox>
  )
}

export default Tweet
