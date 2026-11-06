import http from "node:http";
import fs from "node:fs";
import path from "node:path";

/** Serve exported HTML locally, including repository base paths, without extra dependencies. */
const root = path.resolve("out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};
const server = http.createServer((request, response) => {
  try {
    let pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
    if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`)))
      pathname = pathname.slice(basePath.length) || "/";
    let file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(`${root}${path.sep}`) && file !== root) {
      response.writeHead(403);
      response.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      response.writeHead(404);
      response.end("404");
      return;
    }
    response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
    fs.createReadStream(file).pipe(response);
  } catch {
    response.writeHead(400);
    response.end();
  }
});
server.listen(3000, "127.0.0.1", () =>
  console.log(`Preview: http://localhost:3000${basePath}/pt-BR/`),
);
