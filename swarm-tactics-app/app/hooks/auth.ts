'use client';

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { useState } from "react";

export function useAuth () {
    const [loggedIn, setLoggedIn] = useState(false);
    
    const login = async (name: string, password: string) => {
        const user = await db.user.findUnique({
            where: {
                name,
                password
            }
        });

        if (!user) {
            throw new Error('User not found');
        }
        
        setLoggedIn(true);
    }

    const logout = () => {
        setLoggedIn(false);
    }

    const createAccount = (name: string, password: string) => {
        console.log(`Login with ${name} and ${password}`);
    }

    return {
        loggedIn,
        login,
        logout,
        createAccount
    }
}

export type Auth = ReturnType<typeof useAuth>;
