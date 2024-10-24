import { Request } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import gqlProjection from 'graphql-advanced-projection';
import { ObjectTypeComposer } from 'graphql-compose';
import { composeWithMongoose, composeWithMongooseDiscriminators } from 'graphql-compose-mongoose';
import { ResolverResolveParams } from 'graphql-compose/lib/Resolver';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { Document } from 'mongoose';

import {
  IMongooseAdmin,
  IMongooseSelf,
  IMongooseWarehouse,
  IMongooseWarehouseLocation,
  IMongooseWarehouseProvider,
} from './model';
import {
  Admin,
  ProjectionObject,
  Self,
  User,
  Warehouse,
  WarehouseLocation,
  WarehouseProvider,
} from './mongoose';
import { logGAEvent } from './utilities/gapis';
import { printWarning } from './utilities/log';

/* --------------------------------------- Type composers --------------------------------------- */

export const userTypeComposer = composeWithMongooseDiscriminators(User);
export const selfTypeComposer = userTypeComposer.discriminator<IMongooseSelf>(Self);
export const adminTypeComposer = composeWithMongoose<IMongooseAdmin & Document>(Admin);
export const warehouseLocationTypeComposer = composeWithMongoose<
  IMongooseWarehouseLocation & Document
>(WarehouseLocation);
export const warehouseTypeComposer = composeWithMongoose<IMongooseWarehouse & Document>(Warehouse);
export const warehouseProviderTypeComposer = composeWithMongoose<
  IMongooseWarehouseProvider & Document
>(WarehouseProvider);

/* ------------------------------------- GraphQL projection ------------------------------------- */

// Add fields to the projection based on incoming projection fields
const { project } = gqlProjection({});

/* --------------------------------------- GraphQL helpers -------------------------------------- */

export type GraphQLContext = {
  session: Request['session'];
};

type ResolverFunction = (
  resolverParams: any,
  resolve: (value: any) => void,
  rejectWithLogging: (message: string, error?: unknown) => void,
) => Promise<void> | void;

type ResolveParams = ResolverResolveParams<any, GraphQLContext, Record<string, any>>;

export function createResolver<T = any>(
  purpose: string,
  resolverFunction: ResolverFunction,
  options?: { emptyResult?: any; isAuthenticated?: boolean; isAdminRoute?: boolean },
) {
  return (resolveParams: ResolveParams) =>
    new Promise((resolve, reject) => {
      const startExecution = new Date();

      const rejectWithLogging = (message: string, error?: unknown) => {
        const safeError = error instanceof Error ? error : new Error(message);

        if (safeError) {
          printWarning(safeError.stack);
        }

        logRequest(startExecution, resolveParams);
        reject(new Error(message));
      };

      const resolveWithLogging = async (thenableOrResult?: any | PromiseLike<any>) => {
        let response = thenableOrResult;
        if (typeof thenableOrResult?.then === 'function') {
          response = await response;
        }

        logRequest(startExecution, resolveParams, response);
        resolve(response);
      };

      const { context } = resolveParams;

      const isAuthenticated = options?.isAuthenticated ?? true;
      const isAdminRoute = options?.isAdminRoute ?? false;

      if (isAuthenticated && !context.session?.email) {
        rejectWithLogging(
          'It seems like your session has expired. ⌛ Please refresh the page and log in again',
        );
      }

      if (isAdminRoute && context.session?.role !== 'admin') {
        rejectWithLogging('Unauthorized access to admin route');
      }

      const projection: ProjectionObject<T> = project(resolveParams.info);

      if (projection) {
        (projection as any)._id = 1;
      }

      const customResolveParams = { ...resolveParams, projection };

      (async () => {
        try {
          await resolverFunction(customResolveParams, resolveWithLogging, rejectWithLogging);
        } catch (error) {
          const errorMessage = `Couldn't ${purpose} because of an unknown error`;

          if (options?.emptyResult) {
            resolveWithLogging(options.emptyResult);
            printWarning(errorMessage, error);
          } else {
            rejectWithLogging(errorMessage, error);
          }
        }
      })();
    });
}

export function getParsedInfoForPropertyPath(
  graphqlResolveInfo: GraphQLResolveInfo,
  rootTypeComposer: ObjectTypeComposer,
  propertyPath: { name: string; typeComposer: ObjectTypeComposer }[],
) {
  const resolveInfo = parseResolveInfo(graphqlResolveInfo);

  if (!resolveInfo || !('name' in resolveInfo)) {
    throw new Error("Couldn't parse GraphQL resolve info");
  }

  let parsedInfo = simplifyParsedResolveInfoFragmentWithType(
    resolveInfo as ResolveTree,
    rootTypeComposer.getType(),
  );

  let isFieldMissing = false;

  propertyPath.forEach(({ name, typeComposer }) => {
    if (isFieldMissing || !(name in parsedInfo.fields)) {
      isFieldMissing = true;
      return;
    }

    parsedInfo = simplifyParsedResolveInfoFragmentWithType(
      (parsedInfo.fields as Record<string, any>)[name],
      typeComposer.getType(),
    );
  });

  return !isFieldMissing ? parsedInfo : null;
}

export function getSubfieldProjection<T extends Record<string, any>, U extends Record<string, any>>(
  graphqlResolveInfo: GraphQLResolveInfo,
  rootTypeComposer: ObjectTypeComposer,
  name: keyof T,
  typeComposer: ObjectTypeComposer,
): Partial<Record<keyof U, 1>>;
export function getSubfieldProjection<U extends Record<string, any>>(
  graphqlResolveInfo: GraphQLResolveInfo,
  rootTypeComposer: ObjectTypeComposer,
  propertyPath: { name: string; typeComposer: ObjectTypeComposer }[],
): Partial<Record<keyof U, 1>>;
export function getSubfieldProjection<T extends Record<string, any>, U extends Record<string, any>>(
  graphqlResolveInfo: GraphQLResolveInfo,
  rootTypeComposer: ObjectTypeComposer,
  nameOrPath: keyof T | { name: string; typeComposer: ObjectTypeComposer }[],
  typeComposer?: ObjectTypeComposer,
) {
  const name = typeof nameOrPath === 'string' ? nameOrPath : nameOrPath.toString();
  const propertyPath = Array.isArray(nameOrPath)
    ? nameOrPath
    : [{ name, typeComposer: typeComposer || rootTypeComposer }];

  const subfieldParsedInfo = getParsedInfoForPropertyPath(
    graphqlResolveInfo,
    rootTypeComposer,
    propertyPath,
  );

  if (!subfieldParsedInfo) {
    return {};
  }

  const projection = Object.fromEntries<1>(
    new Map(Object.keys(subfieldParsedInfo.fields).map((fieldName) => [fieldName, 1])),
  ) as Partial<Record<keyof U, 1>>;

  return projection;
}

async function logRequest(startExecution: Date, resolveParams: ResolveParams, response?: any) {
  if (Math.random() < 0.01) {
    const executionTime = new Date().getTime() - startExecution.getTime();

    logGAEvent('request_to_server', {
      name: resolveParams.info.fieldName,
      executionTime,
      size: response ? JSON.stringify(response).length : -1,
      variables: JSON.stringify(resolveParams.info.variableValues),
    });
  }
}
