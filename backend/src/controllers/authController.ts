import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

// Register new user
const registerUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, age, bloodGroup, gender } = req.body;

  // Validate password strength
  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    res.status(400);
    throw new Error('Password must contain at least one uppercase letter');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    res.status(400);
    throw new Error('Password must contain at least one special character');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user (password will be hashed by pre-save middleware)
  const user = await User.create({
    name,
    email,
    password,
    age,
    bloodGroup,
    gender,
  });

  if (user) {
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        createdAt: user.createdAt,
      },
      token: generateToken((user._id as any).toString()),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login user
const loginUser = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        bloodGroup: user.bloodGroup,
        gender: user.gender,
        createdAt: user.createdAt,
      },
      token: generateToken((user._id as any).toString()),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// Get user profile
const getUserProfile = expressAsyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      bloodGroup: user.bloodGroup,
      gender: user.gender,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { registerUser, loginUser, getUserProfile };