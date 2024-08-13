/*_____________STRING_____________*/
export const Stringify = (obj: any) => {
  return JSON.stringify(obj, null, 2);
};

export const Slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

export const Capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const IsObjectEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

export const IsArrayEmpty = (arr: any) => {
  return arr.length === 0;
};

export const IsStringEmpty = (str: string) => {
  return str.trim() === '';
};

export const IsString = (str: string) => {
  return typeof str === 'string';
};

/*_____________MATH_____________*/
export function lcm(x: number, y: number) {
  return x === 0 || y === 0 ? 0 : Math.abs((x * y) / gcd(x, y));
}

export function gcd(x: number, y: number): number {
  return y === 0 ? x : gcd(y, x % y);
}

export function degrees(radians: number) {
  return radians * (180 / Math.PI);
}

export function radians(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function choose(n: number, k: number) {
  if (k > n) return 0;

  return factorial(n) / (factorial(k) * factorial(n - k));
}

const factorialCache = new Map<number, number>([
  [0, 1],
  [1, 1],
]);

export function factorial(n: number): number {
  if (factorialCache.has(n)) return factorialCache.get(n) as number;
  const result = n * factorial(n - 1);
  factorialCache.set(n, result);
  return result;
}

export function sum(numbers: number[]) {
  if (numbers.length <= 0) return 0;
  if (numbers.length === 1) return numbers[0];

  let total = 0;
  for (const number of numbers) total += number;
  return total;
}

export function product(numbers: number[]) {
  if (numbers.length <= 0) return 0;
  if (numbers.length === 1) return numbers[0];

  let total = 1;
  for (const number of numbers) total *= number;
  return total;
}

/*_____________Array / collection_____________*/
export function* windows<T>(input: Iterable<T>, size: number) {
  if (Array.isArray(input)) {
    for (let i = 0; i < input.length - size + 1; i++) {
      yield input.slice(i, i + size);
    }
    return;
  }

  let window: T[] = [];

  for (const x of input) {
    window.push(x);

    if (window.length === size) {
      yield window;
      window = window.slice(1);
    }
  }
}

export function zip<T>(...input: T[][]) {
  return input[0]!.map((_, i) => input.map((array) => array[i]));
}

export function transpose<T>(input: T[][]) {
  return input[0]!.map((_, i) => input.map((array) => array[i]));
}

export function chunk<T>(input: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < input.length; i += size) {
    output.push(input.slice(i, i + size));
  }
  return output;
}

export function* pairs<T>(input: T[]) {
  for (let a = 0; a < input.length; ++a) {
    for (let b = a + 1; b < input.length; ++b) {
      yield [input[a], input[b]] as const;
    }
  }
}

export function* range(start: number, end: number, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

export function objToArray<T>(obj: Record<string, T>): T[] {
  const output: T[] = [];
  for (const key in obj) {
    output.push(obj[key]!);
  }
  return output;
}

/*_____________Set_____________*/
export function intersection<T>(a: T[], b: T[]) {
  return new Set(a.filter((x) => b.includes(x)));
}

/*_____________Flow control_____________*/
export function match<T extends string | number = string, R = unknown>(
  value: T,
  lookup: Record<T, R | ((...args: any[]) => R)>,
  ...args: any[]
): R {
  if (value in lookup) {
    const returnValue = lookup[value];
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue;
  }

  const error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup,
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`,
  );
  if (Error.captureStackTrace) Error.captureStackTrace(error, match);
  throw error;
}

// `throw` is not an expression, so you can't use it like:
// foo || throw new Error('...')
//
// But you can use this instead:
// foo || bail('...')
export function bail(message: string): never {
  const error = new Error(message);
  if (Error.captureStackTrace) Error.captureStackTrace(error, bail);
  throw error;
}

const EMPTY = Symbol('EMPTY') as any;
function defaultCacheKey(...args: any[]): string {
  if (args.length === 0) {
    return EMPTY;
  }

  if (args.length === 1) {
    const arg = args[0];

    if (
      typeof arg === 'string' ||
      typeof arg === 'number' ||
      typeof arg === 'boolean' ||
      typeof arg === 'symbol' ||
      arg === null ||
      arg === undefined
    ) {
      return arg;
    }

    if (Array.isArray(arg)) {
      return arg.map((x) => defaultCacheKey(x)).join(',');
    }

    if (typeof arg === 'object') {
      return JSON.stringify(arg);
    }
  }

  return JSON.stringify(args);
}

/*_____________Performance_____________*/
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  cacheKey: (...args: Parameters<T>) => string = defaultCacheKey,
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = cacheKey(...args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

/*_____________Iterators_____________*/
export function h<T>(it: Iterable<T>) {
  return new IteratorHelpers(it);
}

class IteratorHelpers<T> {
  constructor(private it: Iterable<T>) {}

  first() {
    return this.it[Symbol.iterator]().next().value;
  }

  last() {
    const it = this.it[Symbol.iterator]();
    let x = it.next();
    let last = x.value;
    while (!x.done) {
      last = x.value;
      x = it.next();
    }
    return last;
  }

  empty() {
    return this.it[Symbol.iterator]().next().done;
  }

  map<U>(fn: (x: T) => U) {
    const it = this.it;
    return new IteratorHelpers({
      *[Symbol.iterator]() {
        for (const x of it) {
          yield fn(x);
        }
      },
    });
  }

  every(fn: (x: T) => boolean) {
    for (const x of this.it) {
      if (!fn(x)) return false;
    }
    return true;
  }

  some(fn: (x: T) => boolean) {
    for (const x of this.it) {
      if (fn(x)) return true;
    }
    return false;
  }

  collect() {
    return Array.from(this.it);
  }
}
