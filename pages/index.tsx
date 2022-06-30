import Link from 'next/link'
import Tweet from '../components/Tweet'

export default function Home() {
  return (
    <ul>
      <li>
        <Link href="/long-polling" as="/long-polling">
          <a>First: Long polling</a>
        </Link>
      </li>
      <li>
        <Link href="/grpc-web-unary" as="/grpc-web-unary">
          <a>Second: gRPC-web, single unary call</a>
        </Link>
      </li>
      <li>
        <Link href="/grpc-web-streaming" as="/grpc-web-streaming">
          <a>Second: gRPC-web, server streaming</a>
        </Link>
      </li>
      <Tweet screenName="misund" text="I made this." />
    </ul>
  )
}
