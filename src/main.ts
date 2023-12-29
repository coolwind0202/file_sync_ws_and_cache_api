import { io } from "socket.io-client";

const root = new URL(document.URL).origin;
const socket = io();

socket.on("ping", () => {
  console.log("[client] ping");
})

socket.emit("echo", "Hello");
socket.on("assets", async (filenames: string[]) => {
  const cache = await caches.open("assets");

  const urlsToRemoteFiles = filenames.map(name => new URL(name, root).toString());

  const allCachedRequests = await cache.keys();
  const allCachedURLs = allCachedRequests.map(request => request.url);

  /*
    search new resources to fetch
  */

  const urlsNeedFetch = urlsToRemoteFiles.filter(url => !allCachedURLs.includes(url));
  const requestsNeedFetch = urlsNeedFetch.map(url => new Request(url));

  /*
    search old caches to remove
  */
  const cacheURLsNeedRemove = allCachedURLs.filter(url => !urlsToRemoteFiles.includes(url));
  const cacheRequestsNeedRemove = cacheURLsNeedRemove.map(url => new Request(url));

  /*
    execute fetch new resources and remove old caches
  */
  await cache.addAll(requestsNeedFetch);

  for (const request of cacheRequestsNeedRemove) {
    await cache.delete(request);
  }
});