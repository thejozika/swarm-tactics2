'use client';

import { useState } from "react";
import { Auth } from "../hooks/auth";

interface LoginProps {
    auth: Auth;
}

export default function Login({ auth }: LoginProps) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        auth.login(name, password);
    }

    const createAccount = () => {
        auth.createAccount(name, password);
    }

    return (
        <div className="flex flex-col space-y-4">
            <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="mb-4 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mb-4 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            
            <button 
                onClick={login} 
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
            >
                Login
            </button>
            
            <button 
                onClick={createAccount} 
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
            >
                Create Account
            </button>
        </div>
    )
}
