export const atom = <T extends () => any>(fn: T): ReturnType<T> => fn();
