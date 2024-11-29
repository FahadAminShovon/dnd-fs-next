import React from 'react';

function createRequiredContext<T>(): readonly [
  () => T,
  React.Provider<T | null>,
] {
  const context = React.createContext<T | null>(null);

  const useContext = (): T => {
    const contextValue = React.useContext(context);

    if (contextValue === null) {
      throw new Error('Context value is null');
    }

    return contextValue;
  };

  return [useContext, context.Provider] as const;
}

export { createRequiredContext };
