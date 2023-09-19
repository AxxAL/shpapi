import { Prisma, PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { ServerExceptionType, serverException } from "../types/ServerException";

const prisma = new PrismaClient();

export async function getAllItems({ json }: Context) {
    const items = await prisma.item.findMany();
    return json(items, 200);
}

export async function getItemById({ req, json }: Context) {
    const id = parseInt(req.param("id"));
        
    if (isNaN(id)) return json(serverException(
        ServerExceptionType.INPUT_ERROR,
        "Please use only integers"
    ), 401);
    const first = await prisma.item.findFirst({
        where: { id }
    })
    .catch(() => {
        return json(serverException(
            ServerExceptionType.INPUT_ERROR,
            "Could not find item with matching id."
        ), 404);
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
        return c.json(serverException(
            ServerExceptionType.INPUT_ERROR,
            "Invalid input"
        ), 401);
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
    return c.json(createdItem);
});