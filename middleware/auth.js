import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();


export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = decoded?.id;
      next();
    } else {
      res.status(401).json({
        message: 'Unauthorized,Please login again.',
      });

    }
  }
  catch (err) {
    res.status(401).json({
      message: 'Unauthorized,Please login again.',
    });
  }
}
