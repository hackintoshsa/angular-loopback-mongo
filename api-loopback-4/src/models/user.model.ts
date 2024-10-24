import {Entity, model, property} from '@loopback/repository';

@model()
export class User extends Entity {
  @property({
    type: 'string',
  })
  firstname?: string;

  @property({
    type: 'string',
  })
  lastname?: string;

  @property({
    type: 'string',
    unique: true,
  })
  email: string;

  @property({
    type: 'string',
    required: false,
  })
  password?: string;

  @property({
    type: 'string',
    default: 'img/avatars/racoon.png',
  })
  current_image?: string;

  @property({
    type: 'string',
    required: false,
  })
  sms_mobile?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  verified?: boolean;

  @property({
    type: 'string',
  })
  sms_id?: string;

  @property({
    type: 'string',
  })
  gender?: string;

  @property({
    type: 'string',
  })
  resetPasswordToken?: string;

  @property({
    type: 'date',
  })
  resetPasswordExpires?: Date;

  @property({
    type: 'date',
    default: () => new Date(), // Set default to now
  })
  created_at?: Date;

  @property({
    type: 'date',
    default: () => new Date(), // Set default to now
  })
  updated_at?: Date;

  constructor(data?: Partial<User>) {
    super(data);
  }
}
