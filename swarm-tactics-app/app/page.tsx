'use client';

import Login from "@/components/login";
import Navigation from "@/components/navigation";
import { useAuth } from "@/lib/hooks/auth";

export default function Home() {
  const auth = useAuth();

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="border p-8">
        {auth.loggedIn 
          ? <Navigation
              logout={auth.logout}
            /> 
          : <Login
              auth={auth} 
            />
        }
        <GameCanvasTestComponent />
      </div>
    </main>
  );
}
