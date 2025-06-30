import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string;
      role: 'admin' | 'user';
    };
  }

  interface User {
    id: string;
    username: string;
    email?: string;
    role: 'admin' | 'user';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string;
    role: 'admin' | 'user';
  }
}
