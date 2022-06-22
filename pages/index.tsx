import Link from 'next/link'
import Tweet from '../components/Tweet'

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/a" as="/a">
          <a>a</a>
        </Link>
      </li>
      <li>
        <Link href="/b" as="/b">
          <a>b</a>
        </Link>
      </li>
      <Tweet screenName="misund" text="This is a tweet" />
    </ul>
  )
}
