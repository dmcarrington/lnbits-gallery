import { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if any admin users already exist
    const existingUsers = await UserModel.getAllUsers();
    const adminExists = existingUsers.some(user => user.role === 'admin');

    if (adminExists) {
      return res.status(409).json({ 
        message: 'Admin user already exists. Setup not needed.' 
      });
    }

    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }

    // Create the first admin user
    const adminUser = await UserModel.createUser({
      username,
      password,
      email: email || '',
      role: 'admin'
    });

    if (adminUser) {
      return res.status(201).json({
        message: 'Admin user created successfully',
        user: {
          id: adminUser._id?.toString(),
          username: adminUser.username,
          role: adminUser.role
        }
      });
    } else {
      return res.status(500).json({
        message: 'Failed to create admin user'
      });
    }
  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
}
