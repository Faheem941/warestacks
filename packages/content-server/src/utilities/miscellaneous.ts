import { IMongooseSelf, IMongooseUser } from '../model';

export function selectRandomElements(count: number, elements: any[]) {
  return [...elements].sort(() => 0.5 - Math.random()).slice(0, count);
}

export function hasAccount<T extends Partial<IMongooseUser> | Partial<IMongooseSelf> | null>(
  user: T,
  description: string,
  reject: (message: string, Error?: Error) => void,
): user is Exclude<T, null> {
  if (!user) {
    reject(
      `Couldn't ${description}, because your account was not found.` +
        ' Try logging out and in again.',
    );
    return false;
  }

  return true;
}
