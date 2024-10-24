import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';

import {
  IAdmin,
  IAuthentication,
  ISelf,
  IUser,
  IWarehouse,
  IWarehouseLocation,
  IWarehouseProvider,
} from '@dwms/common/model';

interface IBannedUser {
  email?: string;
  phone?: string;
  bannedBy?: string;
}

// Mongoose types

export type MongooseArray<T> = Types.Array<T>;
type MongooseLeanDocument<T = any> = T & { _id: ObjectId };
export type MongooseDocument<T> = T & Document<ObjectId, {}, T>;

export interface IMongooseUser extends Omit<MongooseLeanDocument<IUser>, 'createdAt'> {
  createdAt: Date;
}

export interface IMongooseSelf
  extends Omit<ISelf, '_id' | 'createdAt' | 'lastActive'>,
    IMongooseUser {
  lastActive?: Date;
}

export interface IMongooseBannedUser extends MongooseLeanDocument<IBannedUser> {}

export interface IMongooseAdmin extends MongooseLeanDocument<IAdmin> {}
export interface IMongooseAuthentication extends MongooseLeanDocument<IAuthentication> {}
export interface IMongooseWarehouse
  extends Omit<
    MongooseLeanDocument<IWarehouse>,
    'location' | 'provider' | 'providerId' | 'locationId'
  > {
  providerId: Types.ObjectId;
  provider: IWarehouseProvider;
  locationId: Types.ObjectId;
  location: IWarehouseLocation;
}
export interface IMongooseWarehouseLocation
  extends Omit<MongooseLeanDocument<IWarehouseLocation>, 'warehouses'> {
  warehouses?: IWarehouse[];
}
export interface IMongooseWarehouseProvider
  extends Omit<MongooseLeanDocument<IWarehouseProvider>, 'warehouses'> {
  warehouses?: IWarehouse[];
}
