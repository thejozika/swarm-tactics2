'use client';

import Login from "./components/login";
import Navigation from "./components/navigration";
import { useAuth } from "./hooks/auth";

export default function Home() {
  const auth = useAuth();

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="border p-8 max-w-md w-full">
        {auth.loggedIn 
          ? <Navigation
              logout={auth.logout}
            /> 
          : <Login
              auth={auth} 
            />
        }
      </div>
    </main>
  );
}
