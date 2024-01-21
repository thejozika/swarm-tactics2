'use server'

import {db} from "@/lib/db";
import { User } from "@prisma/client";

export interface FetchError {
    message: string;
}

export type FetchResult<T> = {
    result: T;
    error: null;
} | {
    result: null;
    error: FetchError;
}

export async function fetch_login(name:string, password:string) : Promise<FetchResult<User>> {
    const user = await db.user.findUnique({
        where: {
            name,
            password
        }
    });

    if (!user) {
        return {
            error: {
                message: "Username or password were incorrect."
            },
            result: null
        };
    }
    
    return {
        result: user,
        error: null
    };
}

export async function fetch_createUser(name:string, password:string) : Promise<FetchResult<User>> {
    try {
        const user = await db.user.create({
            data: {
                name,
                password
            }
        });

        return {
            result: user,
            error: null
        }
    } catch (_) {
        return {
            error: {
                message: "Unable to create user. A user with that name may already exist."
            },
            result: null
        }
    }
}