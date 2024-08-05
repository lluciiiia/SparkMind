export class Redacted<T = string> {
  private constructor(private readonly _value: T) {}

  public static make<T>(value: T) {
    return new Redacted(value);
  }

  public static value<T>(redacted: Redacted<T>): T {
    return redacted._value;
  }

  toString(): string {
    return `<redacted>`;
  }

  toJSON(): string {
    return `<redacted>`;
  }

  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `<redacted>`;
  }

  inspect(): string {
    return `<redacted>`;
  }
}
