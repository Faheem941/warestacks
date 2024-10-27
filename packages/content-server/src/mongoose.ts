import mongoose, {
  Aggregate,
  LeanDocumentOrArrayWithRawType,
  Query,
  QueryWithHelpers,
} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import {
  IMongooseAdmin,
  IMongooseAuthentication,
  IMongooseBannedUser,
  IMongooseSelf,
  IMongooseUser,
  IMongooseWarehouse,
  IMongooseWarehouseLocation,
  IMongooseWarehouseProvider,
} from './model';

mongoose.Promise = global.Promise;

function setRunValidators(this: Query<any, any>) {
  this.setOptions({ runValidators: true, context: 'query' });
}

mongoose.plugin((schema) => {
  schema.pre('findOneAndUpdate', setRunValidators);
  schema.pre('updateMany', setRunValidators);
  schema.pre('updateOne', setRunValidators);
});

/* -------------------------------------- Database Helpers -------------------------------------- */

export async function connect(address: string, isTestDatabase?: boolean) {
  mongoose.set('maxTimeMS', 10000);
  mongoose.set('strictQuery', false);

  return mongoose.connect(`${address}`, {
    dbName: `dwms${isTestDatabase ? '-test' : ''}`,
    writeConcern: {
      w: 'majority',
    },
    retryWrites: true,
  });
}

// Infer result and raw type from mongoose query
type QueryResult<T> = T extends QueryWithHelpers<infer X, any> ? X : never;
type RawDocument<T> = T extends QueryWithHelpers<any, any, {}, infer X> ? X : never;

// Pick fields for result
type PickArrayOrObjectFields<T, U> = keyof U extends keyof T
  ? U[keyof U] extends 1
    ? Pick<T, keyof U> // Projection object with only 1s
    : U[keyof U] extends 0
      ? Pick<T, Exclude<keyof T, keyof U>>
      : T // with only 0s and mixed
  : U extends readonly (keyof T)[]
    ? Pick<T, U[number]>
    : T; // Projection array
type PickFieldsBasic<T, U> = U extends keyof T ? Pick<T, U> : PickArrayOrObjectFields<T, U>;
export type PickFields<T, U> = 0 extends 1 & U
  ? T // If the fields are `any`...
  : U extends null | undefined
    ? T // ... or `null` or `undefined`, return the whole object
    : T extends unknown[]
      ? PickFieldsBasic<T[number], U>[]
      : PickFieldsBasic<T, U>;

// Convert the result to lean
type LeanResult<T, U> = PickFields<
  LeanDocumentOrArrayWithRawType<QueryResult<T>, RawDocument<T>>,
  U
>;

export type ProjectionObject<T = Record<string, any>> = Record<keyof T, 1> | Record<keyof T, 0>;
type Projection<T> = ProjectionObject<T> | keyof T | (keyof T)[] | null;
type AggregateReturn<T> =
  T extends Aggregate<(infer U)[]> ? U : T extends Promise<(infer U)[]> ? U : never;

// Optimization for find queries and aggregations
export function optimized<
  T extends QueryWithHelpers<any, any>,
  U extends Projection<RawDocument<T>>,
>(query: T, projection: U): Promise<LeanResult<T, U>>;
export function optimized<
  T extends Aggregate<Record<string, any>>,
  U extends Projection<AggregateReturn<T>>,
>(aggregation: T, projection: U): Promise<PickFields<AggregateReturn<T>, U>[]>;
export function optimized<T extends any, U extends Projection<Record<string, any>>>(
  query: T,
  projection: U,
) {
  const parsedProjection = parseProjection(projection);

  if (query instanceof mongoose.Query) {
    if (parsedProjection) {
      query.select(parsedProjection);
    }

    return query.lean().exec();
  }

  if (query instanceof mongoose.Aggregate) {
    if (parsedProjection) {
      query.project(parsedProjection);
    }

    return (query as Aggregate<PickFields<T, U>[]>).exec();
  }

  throw new Error('Invalid query type');
}

function parseProjection<T extends Projection<Record<string, number>>>(projection: T) {
  let parsedProjection: Record<string, number> | Record<string, number> | undefined | null;

  if (typeof projection === 'string') {
    parsedProjection = { [projection]: 1 };
  } else if (Array.isArray(projection)) {
    parsedProjection = Object.fromEntries(projection.map((fieldName) => [fieldName, 1]));
  } else {
    parsedProjection = projection;
  }

  return parsedProjection;
}

/* ---------------------------------------- User Schema ----------------------------------------- */

const userSchema = new mongoose.Schema<IMongooseUser>(
  {
    createdAt: {
      type: Date,
      default() {
        return new Date();
      },
    },

    fullName: { type: String, required: false },
    email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
    isBanned: Boolean,
  },
  { discriminatorKey: 'kind', autoCreate: false },
);

userSchema.index({ kind: 1, email: 1 });

userSchema.plugin(uniqueValidator);

export const User = mongoose.model<IMongooseUser>('User', userSchema);

const selfSchema = new mongoose.Schema<IMongooseSelf>(
  {
    phone: {
      type: String,
      index: true,
      uniqueCaseInsensitive: true,
      unique: true,
      required: false,
    },
    company: {
      type: String,
    },
    role: {
      type: String,
    },
    interests: [{ type: String }],
    isOnboardingComplete: { type: Boolean, default: false },
  },
  { autoCreate: false },
);

export const Self = User.discriminator<IMongooseSelf>('Self', selfSchema);

const bannedUserSchema = new mongoose.Schema<IMongooseBannedUser>(
  {
    email: { type: String, unique: true, uniqueCaseInsensitive: true },
    bannedBy: { type: String, required: true },
    phone: { type: String, unique: true, uniqueCaseInsensitive: true },
  },
  { autoCreate: false },
);

export const BannedUser = mongoose.model<IMongooseBannedUser>('BannedUser', bannedUserSchema);

const adminSchema = new mongoose.Schema<IMongooseAdmin>(
  {
    email: { type: String, required: true, unique: true, uniqueCaseInsensitive: true },
    password: { type: String, required: true },
  },
  { timestamps: true, autoCreate: false },
);

export const Admin = mongoose.model<IMongooseAdmin>('Admin', adminSchema);

const authSchema = new mongoose.Schema<IMongooseAuthentication>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
  },
  { timestamps: true, autoCreate: false },
);

export const Authentication = mongoose.model<IMongooseAuthentication>('Authentication', authSchema);

// Warehouse related mongoose models
const warehouseProviderSchema = new mongoose.Schema<IMongooseWarehouseProvider>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
    phone: { type: String },
  },
  { timestamps: true, autoCreate: false },
);

warehouseProviderSchema.virtual('warehouses', {
  ref: 'Warehouse',
  localField: '_id',
  foreignField: 'providerId',
  justOne: false,
});

export const WarehouseProvider = mongoose.model<IMongooseWarehouseProvider>(
  'WarehouseProvider',
  warehouseProviderSchema,
);

// Location Schema
const warehouseLocationSchema = new mongoose.Schema<IMongooseWarehouseLocation>(
  {
    city: { type: String, required: true },
    region: { type: String, required: true },
  },
  { timestamps: true, autoCreate: false },
);

warehouseLocationSchema.virtual('warehouses', {
  ref: 'Warehouse',
  localField: '_id',
  foreignField: 'locationId',
  justOne: false,
});

export const WarehouseLocation = mongoose.model<IMongooseWarehouseLocation>(
  'WarehouseLocation',
  warehouseLocationSchema,
);

// Warehouse Listing Schema
const warehouseSchema = new mongoose.Schema<IMongooseWarehouse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    badges: { type: [String] },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'WarehouseProvider', required: true },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'WarehouseLocation', required: true },
    distanceFromLogisticHub: { type: Number },
  },
  { timestamps: true, autoCreate: false },
);

warehouseSchema.virtual('provider', {
  ref: 'WarehouseProvider',
  localField: 'providerId',
  foreignField: '_id',
  justOne: true,
});

warehouseSchema.virtual('location', {
  ref: 'WarehouseLocation',
  localField: 'locationId',
  foreignField: '_id',
  justOne: true,
});

warehouseSchema.index({ providerId: 1, locationId: 1 });

export const Warehouse = mongoose.model<IMongooseWarehouse>('Warehouse', warehouseSchema);
