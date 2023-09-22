require("dotenv").config();
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createItem, getAllItems, getItemById } from "./controllers/ItemController";

export const config = {
    secret: process.env.API_SECRET as string,
    port: parseInt(process.env.API_PORT as string) || 8787
};

const app = new Hono();

app.use("*", cors());
app.use("*", prettyJSON());
app.use("*", logger());
app.use("/static/*", serveStatic({ root: "./" }));

app.basePath("/item")
    .get("/all", getAllItems)
    .get("/:id", getItemById)
    .post("/create", bearerAuth({ token: config.secret }), createItem);

serve({
    fetch: app.fetch,
    port: config.port,
}, info => console.log(`Started API on http://localhost:${info.port}`));