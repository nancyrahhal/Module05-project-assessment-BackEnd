import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protectAdmin = async (req, res, next) => {
  const headerInput = req.headers['authorization'];
  const token = headerInput && headerInput.split(' ')[1];
  if (token == null) 
    return res.status(401).json('Not authorized');

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded._id);
console.log("user"+ user)
    if (!user) 
      return res.status(404).json('User not found');

    req.user = user;

    if (user.userRole !== 'admin') 
      return res.status(403).json('Access forbidden: Admins only');

    next();
  } catch (error) {
    return res.status(401).json('Invalid token');
  }
};

export default protectAdmin;