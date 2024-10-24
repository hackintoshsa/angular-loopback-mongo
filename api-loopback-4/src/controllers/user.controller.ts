// src/controllers/user.controller.ts
import {post, requestBody, HttpErrors} from '@loopback/rest';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {inject} from '@loopback/core';
import {genSalt, hash} from 'bcrypt'; // Ensure you have bcrypt installed
import {generateToken} from '../utils/token'; // Adjust based on your token generation logic

export class UserController {
  constructor(
    @inject('repositories.UserRepository')
    public userRepository: UserRepository,
  ) {}

  @post('/register')
  async register(
    @requestBody() userData: Omit<User, 'id'>,
  ): Promise<object> {
    const {firstname, lastname, email, password, gender} = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({where: {email}});
    if (existingUser) {
      throw new HttpErrors.Conflict('User Already Exists');
    }

    // Hash the password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Create a new user
    const newUser = await this.userRepository.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      gender,
    });

    // Remove password from response
    delete newUser.password;

    const token = generateToken(newUser); // Ensure your token generation logic is defined
    return {message: 'Successfully Registered', user: newUser, token};
  }

  @post('/login')
  async login(
    @requestBody() credentials: {email: string; password: string},
  ): Promise<object> {
    const {email, password} = credentials;

    // Find user by email
    const user = await this.userRepository.findOne({where: {email}});
    if (!user) {
      throw new HttpErrors.Unauthorized('Incorrect Username');
    }

    if (!user.verified) {
      throw new HttpErrors.Unauthorized('Not Verified, Please Check Emails');
    }

    // Compare password (you may need to implement this in your User model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new HttpErrors.Unauthorized('Incorrect Password');
    }

    // Remove password from response
    delete user.password;

    const token = generateToken(user);
    return {message: 'Successfully Logged In', user, token};
  }
}
