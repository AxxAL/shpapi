"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const hono_1 = require("hono");
const prisma = new client_1.PrismaClient();
const app = new hono_1.Hono();
app.get("/item/all", c => {
    const items = prisma.item.findMany();
    return c.json(items);
});
exports.default = app;
