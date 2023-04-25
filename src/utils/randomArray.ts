export const shuffle = (array: unknown[]) => {
  const result = [...array];
  const shuffled: unknown[] = [];

  while (result.length) {
    const index = Math.floor(Math.random() * result.length);
    const [element] = result.splice(index, 1);
    shuffled.push(element);
  }

  return shuffled;
};
