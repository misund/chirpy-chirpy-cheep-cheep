import * as grpc from '@grpc/grpc-js'
import ping from './handlers/ping'
import tweets from './handlers/tweets'

console.log('this is grpc-server/index.ts')

export function getServer(): grpc.Server {
  const server = new grpc.Server()
  server.addService(ping.service, ping.handler)
  server.addService(tweets.service, tweets.handler)
  return server
}

if (require.main === module) {
  const server = getServer()
  server.bindAsync(
    '0.0.0.0:9090',
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, port: number) => {
      if (err) {
        console.error(`Server error: ${err.message}`)
      } else {
        console.log(`Server bound on port: ${port}`)
        server.start()
      }
    },
  )
} else {
  console.warn('The grpc-server was called, but main !== module')
}
