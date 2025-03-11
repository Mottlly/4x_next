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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token; // ✅ Store the access token
      }
      if (user) {
        token.id = user.id || user.sub; // ✅ Ensure we get the Auth0 ID
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id; // ✅ Ensure user ID is included
      session.accessToken = token.accessToken; // ✅ Expose the JWT
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
