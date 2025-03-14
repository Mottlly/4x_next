import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt", // ✅ Store session as a JWT instead of encrypted cookies
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, // ✅ Ensure JWTs are signed properly
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token; // ✅ Store access token
        token.id = account.providerAccountId; // ✅ Store Auth0 ID
      }
      if (user) {
        token.id = user.id || user.sub; // ✅ Ensure user ID is stored
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🟢 Session Callback - token:", token);

      session.user.id = token.id; // ✅ Expose user ID
      session.accessToken = token.accessToken; // ✅ Ensure token is included
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
