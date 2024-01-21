'use server'

import {db} from "@/lib/db";

export async function fetch_login(name:string, password:string) {
    const user = await db.user.findUnique({
        where: {
            name,
            password
        }
    });
    return user
}