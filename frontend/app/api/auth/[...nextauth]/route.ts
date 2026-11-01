import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Always show Google's account picker instead of auto-using the last account
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };