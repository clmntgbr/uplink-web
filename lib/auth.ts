import { betterAuth } from "better-auth";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    async signIn({ email, password }: { email: string; password: string }) {
      const response = await fetch("https://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const { token, user } = await response.json();

      console.log(token, user);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          token: token
        }
      };
    }
  },
});