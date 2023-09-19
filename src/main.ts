import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { createItem, getAllItems, getItemById } from "./controllers/ItemController";

const app = new Hono();

app.basePath("/item")
    .get("/all", getAllItems)
    .get("/:id", getItemById)
    .post("/create", createItem);

serve({
    fetch: app.fetch,
    port: 8787,
}, info => console.log(`Started API on http://localhost:${info.port}`));