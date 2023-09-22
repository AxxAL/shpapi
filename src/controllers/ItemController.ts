import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";

const prisma = new PrismaClient();

export async function getAllItems({ req, json }: Context) {
    const includeStock = req.queries("stock");
    const items = await prisma.item.findMany({
        include: {
            stock: includeStock != undefined
        }
    });
    return json(items, 200);
}

export async function getItemById({ req, json }: Context) {
    const id = parseInt(req.param("id"));
    const includeStock = req.queries("stock");
        
    if (isNaN(id)) throw new HTTPException(400, { message: "Invalid item id" });
    const first = await prisma.item.findFirst({
        where: { id },
        include: {
            stock: includeStock != undefined
        }
    })
    .catch(() => {
        throw new HTTPException(404, { message: "Could not find matching item" });
    });

    return json(first);
}

const itemSchema = z.object({
    title: z.string(),
    price: z.number(),
    xlarge: z.number(),
    large: z.number(),
    medium: z.number(),
    small: z.number()
});

export const createItem = zValidator("json", itemSchema, async (result, c) => {
    if (!result.success) {
        throw new HTTPException(400, { message: "Invalid request" });
    }

    const item: Prisma.ItemCreateInput = {
        title: result.data.title,
        price: result.data.price,
        stock: {
            create: {
                xlarge: result.data.xlarge,
                large: result.data.large,
                medium: result.data.medium,
                small: result.data.small
            }
        }
    }

    const createdItem = await prisma.item.create({ data: item, include: { stock: true }});
    return c.json(createdItem, 200);
});