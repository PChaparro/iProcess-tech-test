export function useLocalStorage() {
  const saveToLocalStorage = (key: string, value: string) =>
    localStorage.setItem(key, value);

  const getFromLocalStorage: <T>(key: string) => T | null = (key) => {
    const value = localStorage.getItem(key);
    if (!value) return null;

    return JSON.parse(value);
  };

  const removeFromLocalStorage = (key: string) => localStorage.removeItem(key);

  return { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage };
}
