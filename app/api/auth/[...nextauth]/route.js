import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import GithubProvider from "next-auth/providers/github";
// import DiscordProvider from "next-auth/providers/discord";
// import TwitterProvider from "next-auth/providers/twitter";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "/utils/dbMongoClient";
import sendVerificationRequest from "/utils/sendVerification";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,

  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // DiscordProvider({
    //   clientId: process.env.DISCORD_CLIENT_ID,
    //   clientSecret: process.env.DISCORD_CLIENT_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_CLIENT_ID,
    //   clientSecret: process.env.TWITTER_CLIENT_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    //   version: "2.0", // opt-in to Twitter OAuth 2.0
    // }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user }) {
      session.user.role = user.role;
      session.user.id = user.id;
      session.user.tel = user.tel;

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
