# TODO

1. [x] Create a simple front with a client-side direct API call
1. [x] Get Twitter dev account
1. [x] (Implement long polling? Not sure if I need it after gPRC implementation is done)
1. [x] Move the API call to a custom server
1. [x] (Proxy the Twitter API calls for simpler caching?)
1. [x] Create a protobuf definition of the service and messages
1. [x] Implement the gRPC server
1. [x] Implement the gRPC client
1. [ ] (Cache the tweets in a local redis? If I don't cache the external API calls. Figure out how/whether to leverage protobuf for this?)
1. [ ] Dockerize
1. [ ] Deploy somewhere

# Tech calls

- [x] Client: **next** or svelte?
- [x] Server: **next**, plain node or something completely different?
- [x] http or express?
- [x] api: **gRPC** or kafka?
- [x] caching storage. redis? no caching
- [ ] Where to deploy?

# Twitter's very similar tutorial

[[tutorial](https://developer.twitter.com/en/docs/tutorials/building-an-app-to-stream-tweets), [github](https://github.com/twitterdev/real-time-tweet-streamer)]

It turns out there's an official tutorial from Twitter available for which the description closely resembles what I'm setting out to do. I want to make a couple of different choices, but let's keep it around for easy reference.

(For example, I want to use gRPC instead of websockets, and ideally react renders instead of embeds. One can argue that using protocol buffers instead of Twitter's original JSON responses might complicate things unnecessary, but there's a chance for me to learn something new while working on this instead of just replicating somebody else's code.

Also, I might try to run the API off the same server as the front app, instead making the division on server vs client code. Haven't decided yet whether this will make things easier or more complicated.

# Prerequisites

you'll need

- docker
- node 18
- yarn

## Install

```
yarn
cp .env.sample .env # then edit .env to add a Twitter bearer token
```

## Develop

```
yarn dev
```

That should do it. It spins up a grpc server, an envoy proxy and a nextjs server. Then go have a look at <a href="localhost:3000">localhost:3000</a>.

## Run

```
yarn build

yarn start

# yarn start:next # localhost:3000
# yarn start:envoy # localhost:8080
# yarn start:grpc # localhost:9090
```

This bit could be improved. Envoy is dockerized from elsewhere. I would like to dockerize the two others as well and maybe run them through docker-compose.

## What' Missing

- tests
- ci/cd flows
- kubernetes
- cleaning up disused streams doesn't work the way I thought
