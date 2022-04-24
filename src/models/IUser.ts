import { WhatIsIt } from '@typegoose/typegoose/lib/internal/constants';
import { prop, getModelForClass, ModelOptions, Severity } from '@typegoose/typegoose';

@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
class IUser {

  @prop({ required: false })
  id!: string;

  @prop({ required: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ required: true })
  full_name!: string;

  @prop({ required: true, type: [String] }, WhatIsIt.ARRAY)
  roles!: string[];

  @prop({ required: false, type: [String] }, WhatIsIt.ARRAY)
  notification_tokens?: string[];

  @prop({ required: false, default: Date.now })
  created_at!: Date;

  @prop({ required: false, default: Date.now })
  updated_at!: Date;

}

const UserModel = getModelForClass(IUser, {
  schemaOptions: {
    autoCreate: false,
    minimize: true,
    strict: true,
    _id: false,
    id: false,
  }
});

export {
  IUser,
  UserModel
}