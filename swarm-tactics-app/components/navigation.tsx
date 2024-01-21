'use client';

import { useState } from "react";
import { Editor } from "./editor";

export interface NavigationProps {
    logout: ()=>void;
}
export default function Navigation({ logout }: NavigationProps) {
    const [selected, setSelected] = useState<string | null>(null);
    
    const getSelection = (selected: string | null) => {
        switch(selected) {
            case 'Editor':
                return <Editor />
            default:
                return <MainNavigation setSelected={setSelected} logout={logout}/>;
        }
    }

    return (
        <div>
            {selected != null ? <button onClick={() => setSelected(null)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700">Back</button> : null}
            {getSelection(selected)}
        </div>
        
    )
}

interface MainNavigationProps {
    logout: ()=>void;
    setSelected: (selected: string)=>void;
}

function MainNavigation(props: MainNavigationProps) {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-riw w-full">
                <input 
                    type="text"
                    placeholder="Opponent Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                
                <button 
                    className="w-full bg-blue-500 text-white font-bold px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
                >
                    Start Match
                </button>

            </div>
            
            <button 
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
            >
                Watch a game
            </button>
            
            <button 
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
                onClick={() => props.setSelected('Editor')}
            >
                Edit Bot
            </button>
            
            <button 
                onClick={props.logout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-red-600 active:bg-red-700"
            >
                Logout
            </button>
        </div>
    )
}