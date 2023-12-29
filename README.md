# File sync between server & client

A feature enables file sync between server and client.
When add / remove `assets/` directory files, the change will be notificated to client through WebSocket connection.
On the client app,  interpreting the notification, the `main.ts` logics fetch new resources and remove old caches.

## warning

This implementation is incomplete. 
It can understand add / remove files, but not modify files.
If you want to execute it correctly, you need to add a unique version hash to distributed files.