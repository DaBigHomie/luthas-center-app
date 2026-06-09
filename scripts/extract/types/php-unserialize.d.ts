declare module 'php-unserialize' {
  export function unserialize(input: string): unknown;
  export function unserializeSession(input: string): unknown;
}
