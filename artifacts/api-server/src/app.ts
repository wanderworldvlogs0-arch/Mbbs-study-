import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import fs from "fs";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";
import { attachUser } from "./middlewares/require-auth";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

app.use("/api", router);

// If artifacts/web has been built (e.g. `pnpm --filter @workspace/web run
// build` as part of a production deploy), serve it from this same server.
// That keeps API and frontend on one origin — no CORS/cross-site cookie
// config needed — which is the simplest setup for a single-service host
// like Render. In Replit, the frontend instead runs as its own artifact and
// this block is a no-op (the directory won't exist).
const webDistPath = path.resolve(import.meta.dirname, "../../web/dist");
if (fs.existsSync(webDistPath)) {
  app.use(express.static(webDistPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(webDistPath, "index.html"));
  });
}

export default app;
