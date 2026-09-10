import axios from "axios"

export const api = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config

  const storageKey = "kurio:visitor-id"
  let visitorId = window.localStorage.getItem(storageKey)
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    window.localStorage.setItem(storageKey, visitorId)
  }

  config.headers.set("X-Visitor-Id", visitorId)
  return config
})
