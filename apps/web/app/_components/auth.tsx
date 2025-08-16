"use client";

import { useState } from "react";
import { AuthModal, createAuthClient } from "auth-client";

const client = createAuthClient({
  baseURL:
    "https://6pmchmr7hbk3pa67v65zanflre0kaiyo.lambda-url.us-west-2.on.aws/",
});

export function AuthConnect() {
  const [open, setOpen] = useState(false);
  const { data: session } = client.useSession();

  return (
    <div className="flex items-center gap-3">
      {session ? (
        <>
          <span className="text-sm">
            Welcome, {session.user.name ?? session.user.email}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200"
            onClick={() =>
              client.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    // Optional: refresh the page or route
                    window.location.reload();
                  },
                },
              })
            }
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <button
            className="px-4 py-2 rounded bg-black text-white"
            onClick={() => setOpen(true)}
          >
            Connect
          </button>
          <AuthModal
            open={open}
            onClose={() => setOpen(false)}
            client={client}
          />
        </>
      )}
    </div>
  );
}
