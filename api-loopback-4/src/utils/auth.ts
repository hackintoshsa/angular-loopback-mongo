import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import {UserRepository} from '../repositories/user.repository'; // Adjust path as necessary
import {inject} from '@loopback/core';

export function ensureAuthenticated(userRepository: UserRepository) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).send({message: 'You did not provide a JSON Web Token in the Authorization header.'});
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload: any = jwt.verify(token, process.env.TOKEN_SECRET); // Verify token
      const now = moment().unix();

      if (now > payload.exp) {
        return res.status(401).send({message: 'Token has expired.'});
      }

      const user = await userRepository.findById(payload.sub);
      if (!user) {
        return res.status(400).send({message: 'User no longer exists.'});
      }

      req.user = user; // Attach user to request
      next();
    } catch (error) {
      return res.status(401).send({message: 'Invalid token.'});
    }
  };
}
