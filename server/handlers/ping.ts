import grpc from '@grpc/grpc-js'
import {
  IPingPongServiceServer,
  PingPongServiceService,
  // PingPongServiceClient,
} from '../../generated/proto/ping_grpc_pb'
import { PlainMessage } from '../../generated/proto/ping_pb'

const pingPongHandler: IPingPongServiceServer = {
  ping(
    call: grpc.ServerUnaryCall<PlainMessage, PlainMessage>,
    callback: grpc.sendUnaryData<PlainMessage>,
  ): void {
    const pingText = call.request.getText()
    console.log('ping text: ', pingText)

    const pong = new PlainMessage()
    pong.setText('pong')

    callback(null, pong)
  },
}

export default {
  service: PingPongServiceService,
  handler: pingPongHandler,
  // client: new PingPongServiceClient('', grpc.credentials.createInsecure()),
}
