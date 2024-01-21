'use client';

export interface NavigationProps {
    logout: ()=>void;
}
export default function Navigation({ logout }: NavigationProps) {

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-riw space-y-4">
                <input 
                    type="text"
                    placeholder="Opponent Name"
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                
                <button 
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
                >
                    Login
                </button>

            </div>
            
            <button 
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
            >
                Create Account
            </button>
            
            <button 
                onClick={logout}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out hover:bg-blue-600 active:bg-blue-700"
            >
                Logout
            </button>
        </div>
    )
}
