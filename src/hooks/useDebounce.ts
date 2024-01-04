export function useDebounce(func: (...args: any[]) => void, delay: number) {
  let inDebounce: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(this, args), delay);
  };
}
