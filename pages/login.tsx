import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../lib/auth';
import LoginForm from '../components/LoginForm';
import Head from 'next/head';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login - LNBits Gallery</title>
        <meta name="description" content="Login to access the admin dashboard" />
      </Head>
      <LoginForm />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If user is already logged in, redirect to appropriate page
  if (session) {
    if (session.user.role === 'admin') {
      return {
        redirect: {
          destination: '/admin/dashboard',
          permanent: false,
        },
      };
    } else {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {},
  };
};
