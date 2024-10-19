// Make the selected property of the object required
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// SomeAreRequired picks all keys in T and makes them required,
// then adds it to T with the K keys omitted, effectively making only the selected keys required.
export type SomeAreRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
