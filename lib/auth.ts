import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserModel } from '../models/User';
import { SessionUser } from './definitions';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const user = await UserModel.validatePassword(
            credentials.username,
            credentials.password
          );

          if (user) {
            return {
              id: user._id?.toString() || '',
              username: user.username,
              email: user.email,
              role: user.role
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.sub || '',
          username: token.username as string,
          email: token.email,
          role: token.role as 'admin' | 'user'
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
};
