import express from "express";
import expressWs from "express-ws";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import { createServer } from "http";
import chokidar from "chokidar";
import fs from "fs";

const app = express();
const server = createServer(app);

/* 
  notificate file changes to client
*/
const io = new Server(server);
io.on("connection", socket => {
  socket.on("echo", msg => {
    console.log(`[server] ${msg}`);
    socket.emit(msg);
  });
});

chokidar.watch("./assets").on("all", (event, path) => {
  const fileEntriesWithDir = fs.readdirSync("assets", { recursive: true, withFileTypes: true });
  const fileEntries = fileEntriesWithDir.filter(entry => entry.isFile());
  const filenames = fileEntries.map(entry => `${entry.path}/${entry.name}`);
  console.log(`[debug] ${filenames}`);
  io.emit("assets", filenames);
});

/*
  distribute static file through express.js
*/
app.use(express.static('assets'));


/*
  Server config
*/
const run = async () => {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "mpa"
  });

  app.use((req, res, next) => {
    vite.middlewares.handle(req, res, next)
  });

  server.listen(3000, () => {
    console.log("server running...  http://localhost:3000")
  });
}

run();