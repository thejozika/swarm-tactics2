'use client';

import { useState } from "react";
import {fetch_login} from "@/lib/fetch/fetch_login";

export function useAuth () {
    const [loggedIn, setLoggedIn] = useState(false);
    
    const login = async (name: string, password: string) => {
        const user = await fetch_login(name,password)

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
