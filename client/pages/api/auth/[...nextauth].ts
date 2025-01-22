import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Add your authentication logic here
        // Return null if user data could not be retrieved
        // Return user object if authenticated
        const user = { id: "1", name: credentials?.username };
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
