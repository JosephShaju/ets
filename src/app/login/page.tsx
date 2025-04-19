"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const params = useSearchParams();
  const role = params.get("role") ?? ""; // “staff” or “organizer”
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    // wait / fetch session
    const session = await getSession();
    const userRole = session?.user?.role;
    if (userRole === "organizer") router.push("/organizer");
    else if (userRole === "staff") router.push("/staff");
    else router.push("/attendee");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-96 p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          Login as {role || "User"}
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label>Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Login
          </button>
        </form>

        {role === "staff" && (
          <p className="text-center mt-4">
            Don’t have an account?{" "}
            <a
              href={`/register?role=staff`}
              className="text-blue-600 hover:underline"
            >
              Register here
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
