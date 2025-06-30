import { NextApiRequest, NextApiResponse } from 'next';
import { UserModel } from '../../../models/User';
import { AuthResponse } from '../../../lib/definitions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { username, password, email, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create new user
    const newUser = await UserModel.createUser({
      username,
      password,
      email,
      role: role as 'admin' | 'user'
    });

    if (newUser) {
      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser._id?.toString() || '',
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        }
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
