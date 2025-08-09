import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { authClient } from "./lib/auth-client";

function App() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {session ? (
          <>
            <div className="text-sm text-gray-700">
              Welcome,{" "}
              <span className="font-medium">
                {session.user.name ?? session.user.email}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      // optional: window.location.reload()
                    },
                  },
                })
              }
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setOpen(true)}>Connect</Button>
            <Button variant="secondary" onClick={() => setCount((c) => c + 1)}>
              Click me
            </Button>
          </>
        )}
      </div>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default App;
