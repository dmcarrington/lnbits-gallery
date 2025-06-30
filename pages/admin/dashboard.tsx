import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';
import { useSession, signOut } from 'next-auth/react';
import { authOptions } from '../../lib/auth';
import { UserModel } from '../../models/User';
import { User } from '../../lib/definitions';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { CldUploadButton, CloudinaryUploadWidgetInfo } from "next-cloudinary";

interface DashboardProps {
  users: User[];
  totalUsers: number;
  galleryStats: {
    totalImages: number;
    paywallImages: number;
  };
}

export default function AdminDashboard({ users, totalUsers, galleryStats }: DashboardProps) {
  const { data: session } = useSession();
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  });
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('User created successfully!');
        setNewUser({ username: '', password: '', email: '', role: 'user' });
        setShowCreateUser(false);
        // Refresh the page to show new user
        window.location.reload();
      } else {
        setMessage(data.message || 'Failed to create user');
      }
    } catch (error) {
      setMessage('An error occurred while creating the user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - LNBits Gallery</title>
        <meta name="description" content="Admin dashboard for LNBits Gallery" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-gray-900 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">
                  Welcome, {session?.user?.username}
                </span>
                <Link
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  View Gallery
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">I</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Total Images
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {galleryStats.totalImages}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">P</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Paywall Images
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {galleryStats.paywallImages}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-white">
                  User Management
                </h3>
                <button
                  onClick={() => setShowCreateUser(!showCreateUser)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  {showCreateUser ? 'Cancel' : 'Create User'}
                </button>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-md ${
                  message.includes('success') 
                    ? 'bg-green-800 text-green-200' 
                    : 'bg-red-800 text-red-200'
                }`}>
                  {message}
                </div>
              )}

              {showCreateUser && (
                <form onSubmit={handleCreateUser} className="mb-6 p-4 bg-gray-700 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Role
                      </label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'user' })}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {isCreating ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              )}

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-600">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-800 text-red-200' 
                              : 'bg-blue-800 text-blue-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
            </div>
          </div>
          <div className="flex justify-between items-center py-6"> 
            <CldUploadButton    
                    uploadPreset="gallery-admin"
                    onSuccess={(results)=> {
                        console.log("Upload successful", results);
                        let info = results.info as CloudinaryUploadWidgetInfo;
                        const public_id = info.public_id;
                        const url = info.url
                        createPaywall(public_id, url);
                    }}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
                />
            </div>
        </main>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Check if user is authenticated and is admin
  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  try {
    // Get all users
    const users = await UserModel.getAllUsers();
    const totalUsers = await UserModel.countUsers();

    // Get gallery stats (you can expand this based on your needs)
    const galleryStats = {
      totalImages: 0, // This would come from your Cloudinary API or database
      paywallImages: 0, // This would come from your database
    };

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        totalUsers,
        galleryStats,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      props: {
        users: [],
        totalUsers: 0,
        galleryStats: {
          totalImages: 0,
          paywallImages: 0,
        },
      },
    };
  }
};

export async function createPaywall(public_id: string, url: string) {
    fetch("/api/post/paywall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_id, url }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      }
      ); 
  }