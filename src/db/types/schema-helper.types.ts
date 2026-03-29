export type DbTableDefinition<T, K extends string = never> = {
  [P in keyof T | K]: unknown;
};
