import { useState } from "react";
import "./App.css";
import reactLogo from "./assets/react.svg";
import { AuthModal } from "./components/AuthModal";
import { Button } from "./components/ui/button";
import { authClient } from "./lib/auth-client";
import viteLogo from "/vite.svg";
// import { kit } from "./lib/kit/init";
import { LOBSTR_ID } from "@creit.tech/stellar-wallets-kit";
import { kit } from "./lib/kit/init";

function App() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();

  async function handleModalOpen() {
    kit.setWallet(LOBSTR_ID);
    const address = await kit.getAddress();
    console.log(address, "adress");

    const res = kit.signTransaction("hello sir");
    console.log(res, "hi");
  }

  function fetchSession() {
    authClient
      .getSession({
        fetchOptions: {
          onSuccess: (ctx) => {
            const jwt = ctx.response.headers.get("set-auth-jwt");
            console.log("jwt got", jwt);
          },
        },
      })
      .then((session) => {
        console.log(session, "toml ");
      });
  }

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
      <div>
        <button onClick={handleModalOpen}>open model </button>
      </div>
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
            <Button variant="secondary" onClick={() => fetchSession()}>
              Click me
            </Button>
          </>
        )}
      </div>
      <Button variant="secondary" onClick={() => fetchSession()}>
        Click me (feth)
      </Button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default App;
