'use server';

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export async function login (name: string, password: string) {
    const user = await db.user.findUnique({
        where: {
            name,
            password
        }
    });

    if (!user) {
        throw new Error('User not found');
    }
    
    return user;
}