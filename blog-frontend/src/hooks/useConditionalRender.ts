import { useMemo } from 'react';

type RenderCondition<T> = {
  when: boolean;
  render: () => T;
};

export function useConditionalRender<T>(...conditions: RenderCondition<T>[]): T | null {
  return useMemo(() => {
    for (const condition of conditions) {
      if (condition.when) {
        return condition.render();
      }
    }
    return null;
  }, [conditions]);
}
