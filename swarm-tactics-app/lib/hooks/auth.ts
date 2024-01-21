'use client';

import { useState } from "react";
import {fetch_createUser, fetch_login} from "@/lib/fetch/fetch_login";

export function useAuth () {
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState<Error>();
    
    const login = async (name: string, password: string) => {
        const result = await fetch_login(name,password)

        if (result.error) {
            setError(new Error(result.error.message));
            return;
        }
        
        setLoggedIn(true);
        setError(undefined);
    }

    const logout = () => {
        setLoggedIn(false);
    }

    const createAccount = async (name: string, password: string) => {
        const result = await fetch_createUser(name,password);

        if (result.error) {
            setError(new Error(result.error.message));
            return;
        }

        setLoggedIn(true);
        setError(undefined);
    }

    return {
        loggedIn,
        error,
        login,
        logout,
        createAccount
    }
}

export type Auth = ReturnType<typeof useAuth>;
