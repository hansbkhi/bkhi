import { Request, Response, NextFunction } from 'express';

// Simplified middleware just for admin access
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminKey = req.header('X-Admin-Key');
    
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};