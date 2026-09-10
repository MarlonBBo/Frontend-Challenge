import { io, type Socket } from "socket.io-client"
import { WebSocket as EngineWebSocket } from "engine.io-client"
import type { ClientToServerEvents, ServerToClientEvents } from "@/contracts"

let realtimeSocket: Socket<ServerToClientEvents, ClientToServerEvents> | undefined

class CurrentWebSocketTransport extends EngineWebSocket {
  get name() {
    return "websocket"
  }

  createSocket(uri: string, protocols: string | string[] | undefined) {
    return protocols ? new globalThis.WebSocket(uri, protocols) : new globalThis.WebSocket(uri)
  }
}

export function getRealtimeSocket() {
  if (!realtimeSocket) {
    realtimeSocket = io(import.meta.env.VITE_SOCKET_URL || undefined, {
      autoConnect: false,
      transports: [CurrentWebSocketTransport],
      reconnection: true,
    })
  }

  return realtimeSocket
}
