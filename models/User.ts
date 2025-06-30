import { MongoClient, Db, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import { User } from '../lib/definitions';
import { client, Connect } from '../lib/mongodb';

export class UserModel {
  private static db: Db;
  private static collection: Collection<User>;

  private static async getCollection(): Promise<Collection<User>> {
    if (!this.collection) {
      await Connect();
      this.db = client.db('lnbits-gallery');
      this.collection = this.db.collection<User>('users');
      
      // Create unique index on username
      await this.collection.createIndex({ username: 1 }, { unique: true });
    }
    return this.collection;
  }

  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User | null> {
    try {
      const collection = await this.getCollection();
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      const user: Omit<User, '_id'> = {
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await collection.insertOne(user as User);
      
      if (result.insertedId) {
        const createdUser = await collection.findOne({ _id: result.insertedId });
        return createdUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  static async findByUsername(username: string): Promise<User | null> {
    try {
      const collection = await this.getCollection();
      const user = await collection.findOne({ username });
      return user;
    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  }

  static async validatePassword(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (isValid) {
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error validating password:', error);
      return null;
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const collection = await this.getCollection();
      const users = await collection.find({}).toArray();
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  static async updateUser(username: string, updates: Partial<User>): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      
      // If password is being updated, hash it
      if (updates.password) {
        const saltRounds = 12;
        updates.password = await bcrypt.hash(updates.password, saltRounds);
      }
      
      updates.updatedAt = new Date();
      
      const result = await collection.updateOne(
        { username },
        { $set: updates }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }

  static async deleteUser(username: string): Promise<boolean> {
    try {
      const collection = await this.getCollection();
      const result = await collection.deleteOne({ username });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  static async countUsers(): Promise<number> {
    try {
      const collection = await this.getCollection();
      return await collection.countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }
}
