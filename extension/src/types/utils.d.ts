type DeepReadonly<T extends Record<string, unknown>> = {
  readonly [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends (...args: Array<unknown>) => unknown
      ? T[K]
      : DeepReadonly<T[K]>
    : T[K];
};

type ReadonlyArray<T> = DeepReadonly<Array<T>>;

type DeepPartial<T extends Record<string, unknown>> = {
  [K in keyof T]?: T[K] extends Record<string, any>
    ? T[K] extends (...args: Array<unknown>) => unknown
      ? T[K]
      : DeepPartial<T[K]>
    : T[K];
};

type PartialArray<T> = Array<T> | Array<PartialArray<T>>;

type DeepRequired<T extends Record<string, unknown>> = {
  [K in keyof T]-?: T[K] extends Record<string, any>
    ? T[K] extends (...args: Array<unknown>) => unknown
      ? T[K]
      : DeepRequired<T[K]>
    : T[K];
};

type RequiredArray<T> = Array<T> | Array<RequiredArray<T>>;

type DeepNonNullable<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends (...args: Array<unknown>) => unknown
      ? T[K]
      : DeepNonNullable<T[K]>
    : NonNullable<T[K]>;
};

type NonNullableArray<T> = Array<T> | Array<NonNullableArray<T>>;

type DeepNullable<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Record<string, any>
    ? T[K] extends (...args: Array<unknown>) => unknown
      ? T[K]
      : DeepNullable<T[K]>
    : T[K] | null;
};

type NullableArray<T> = Array<T> | Array<NullableArray<T>>;

type UUID = `${string}-${string}-${string}-${string}-${string}`;