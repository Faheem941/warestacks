import { DataProxy } from '@apollo/client';
import { ISelf, IUser } from '@warestacks/common/model';
import { selfQuery, userQuery } from '../schema/user';

function findField(data: object, fieldName: string) {
  const matchingFields = Object.entries(data).filter(([key]) => key === fieldName);

  return matchingFields[0] && matchingFields[0][1];
}

export const createSelfUpdater =
  (mutationName: string) => (cache: DataProxy, result: { data?: any } | null | undefined) => {
    if (result?.data[mutationName]) {
      const self = getCachedSelf(cache);
      updateSelfCacheFields(result.data[mutationName], self, cache);
    }
  };

export const createSelfPropertyUpdater =
  <T, U>(
    mutationName: string,
    fieldName: string,
    readCallback: (cacheData: T, responseData: U) => T,
  ) =>
  (cache: DataProxy, result: { data?: any } | null | undefined) => {
    if (result?.data && Object.prototype.hasOwnProperty.call(result.data, mutationName)) {
      const { data } = result;

      const self = getCachedSelf(cache);
      const newData = readCallback(findField(self || {}, fieldName), findField(data, mutationName));

      updateSelfCacheFields({ [fieldName]: newData }, self, cache);
    }
  };

export function updateSelfProperty<T>(fieldName: string, newFieldValue: T, cache: DataProxy) {
  const self = getCachedSelf(cache);
  updateSelfCacheFields({ [fieldName]: newFieldValue }, self, cache);
}

export function getCachedSelf(cache: DataProxy) {
  const cachedSelfData: { self: ISelf } | null = cache.readQuery({ query: selfQuery });
  return cachedSelfData?.self;
}

export function updateSelfCacheFields(
  updatedFields: Record<string, any>,
  self: ISelf | undefined,
  cache: DataProxy,
) {
  cache.writeQuery({ query: selfQuery, data: { self: { ...self, ...updatedFields } } });

  const { username } = updatedFields;
  if (username) {
    const cachedUserData: { user: IUser } | null = cache.readQuery({
      query: userQuery,
      variables: { username },
    });

    if (cachedUserData?.user) {
      cache.writeQuery({
        query: userQuery,
        data: {
          user: {
            ...cachedUserData?.user,
            ...updatedFields,
            /* eslint-disable no-underscore-dangle */
            // @ts-expect-error
            __typename: cachedUserData?.user.__typename,
          },
        },
        variables: { username },
      });
    }
  }
}
