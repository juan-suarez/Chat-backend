import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).send('No token provided. Access denied.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjunta los datos decodificados al objeto `req`
    next(); // Continua hacia el siguiente middleware o controlador
  } catch (error) {
    res.status(403).send('Invalid or expired token. Access denied.');
  }
};
