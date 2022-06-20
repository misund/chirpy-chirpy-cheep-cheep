
# TODO
1. [ ] Create a simple front with a client-side direct API call
1. [ ] Get Twitter dev account
1. [ ] (Implement long polling? Not sure if I need it after gPRC implementation is done)
1. [ ] Move the API call to a custom server
1. [ ] (Proxy the Twitter API calls for simpler caching?)
1. [ ] Create a protobuf definition of the service and messages
1. [ ] Implement the gRPC server
1. [ ] Implement the gRPC client
1. [ ] (Cache the tweets in a local redis? If I don't cache the external API calls. Figure out how/whether to leverage protobuf for this?)

# Tech calls
- [x] Client: **next** or svelte?
- [x] Server: **next**, plain node or something completely different?
- [ ] http or express?
- [x] api: **gRPC** or kafka?
- [ ] caching storage. redis?

# Twitter's very similar tutorial
[[tutorial](), [github](https://github.com/twitterdev/real-time-tweet-streamer)]

It turns out there's an official tutorial from Twitter available for which the description closely resembles what I'm setting out to do. I want to make a couple of different choices, but let's keep it around for easy reference.

(For example, I want to use gRPC instead of websockets, and ideally react renders instead of embeds. One can argue that using protocol buffers instead of Twitter's original JSON responses might complicate things unnecessary, but there's a chance for me to learn something new while working on this instead of just replicating somebody else's code.

Also, I might try to run the API off the same server as the front app, instead making the division on server vs client code. Haven't decided yet whether this will make things easier or more complicated.

# Custom server with TypeScript + Nodemon example

The example shows how you can use [TypeScript](https://typescriptlang.com) on both the server and the client while using [Nodemon](https://nodemon.io/) to live reload the server code without affecting the Next.js universal code.

Server entry point is `server/index.ts` in development and `dist/index.js` in production.
The second directory should be added to `.gitignore`.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example) or preview live with [StackBlitz](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/custom-server-typescript)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/custom-server-typescript)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example custom-server-typescript custom-server-typescript-app
# or
yarn create next-app --example custom-server-typescript custom-server-typescript-app
# or
pnpm create next-app --example custom-server-typescript custom-server-typescript-app
```
