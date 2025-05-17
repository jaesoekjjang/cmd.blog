export const getKeyName = (e: React.KeyboardEvent) => {
  if (e.ctrlKey) {
    return `<C-${e.key}>`;
  } else if (e.shiftKey) {
    return `<S-${e.key}>`;
  } else if (e.altKey) {
    return `<A-${e.key}>`;
  }

  if (e.key === ' ' || e.key === 'Spacebar') {
    return 'Space';
  }

  return e.key;
};
