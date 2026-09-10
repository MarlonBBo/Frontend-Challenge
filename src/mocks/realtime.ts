import { toSocketIo } from "@mswjs/socket.io-binding"
import { ws } from "msw"
import type { NftUpdatedEvent } from "@/contracts"

const realtimeProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
const realtime = ws.link(`${realtimeProtocol}//${window.location.host}`)
const clients = new Set<ReturnType<typeof toSocketIo>["client"]>()

export const realtimeHandlers = [
  realtime.addEventListener("connection", (connection) => {
    const { client } = toSocketIo(connection)
    clients.add(client)

    client.on("session.identify", () => {
      // O mock não possui salas. A identificação mantém o contrato usado pelo cliente.
    })

    connection.client.addEventListener("close", () => {
      clients.delete(client)
    })
  }),
]

export function broadcastNftUpdated(event: NftUpdatedEvent) {
  clients.forEach((client) => client.emit("nft.updated", event))
}

export function getRealtimeClientCount() {
  return clients.size
}
