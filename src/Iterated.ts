export type Iterated<T> = T extends Iterable<infer U> ? U : never;
