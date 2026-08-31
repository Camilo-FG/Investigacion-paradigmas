type ForbiddenListener = (message: string) => void;

let listener: ForbiddenListener | null = null;

export const apiErrorBus = {
  subscribe(fn: ForbiddenListener) {
    listener = fn;
    return () => {
      if (listener === fn) listener = null;
    };
  },
  publish(message: string) {
    listener?.(message);
  },
};
