import { prop, ModelOptions, Severity } from '@typegoose/typegoose';

@ModelOptions({ options: { allowMixed: Severity.ALLOW } })
class IApplication {

  @prop({ required: true})
  id!: string;

  @prop({ required: true})
  name!: string;

}

export {
  IApplication,
}