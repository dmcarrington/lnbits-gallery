import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        
        // For other protected routes, just check if user is authenticated
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    // Add other protected routes here if needed
  ]
};
