import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "invite-code",
      name: "Invite Code",
      credentials: {
        email: { label: "Email", type: "email" },
        inviteCode: { label: "Invite Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.inviteCode) {
          throw new Error("Email and invite code are required");
        }

        const email = credentials.email.trim().toLowerCase();
        const inviteCode = credentials.inviteCode.trim().toUpperCase();

        // Look up customer by invite code
        const customer = await prisma.customer.findUnique({
          where: { inviteCode },
        });

        if (!customer) {
          throw new Error("Invalid invite code");
        }

        // Find existing user or create one
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (user) {
          // Link existing user to this customer
          user = await prisma.user.update({
            where: { id: user.id },
            data: { customerId: customer.id },
          });
        } else {
          // Create new user linked to customer
          user = await prisma.user.create({
            data: {
              email,
              customerId: customer.id,
            },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: process.env.NODE_ENV === "production" ? ".northend.law" : undefined,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: process.env.NODE_ENV === "production" ? ".northend.law" : undefined,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth-error",
  },
};
