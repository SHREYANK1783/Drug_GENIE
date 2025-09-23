import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import User, { IUser } from '../models/userModel'; // Import the IUser interface
import { Request, Response, NextFunction } from 'express';

// Define and export a custom interface for our request object                          
export interface AuthRequest extends Request {
  user?: IUser; // Attach the user property with the correct IUser type
}

const protect = expressAsyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {      
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };                        
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);            
      throw new Error('Not authorized, token failed');             
    }
  }
  if (!token) {
    res.status(401);                      
    throw new Error('Not authorized, no token');              
  }
});

export { protect };              