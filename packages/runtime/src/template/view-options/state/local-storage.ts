import { ViewOptions, ViewOptionsState } from './state';

const localStorageKey = 'view-options';

export function getCachedState(): Partial<ViewOptions> {
  try {
    const cached = window.localStorage.getItem(localStorageKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }
  } catch (err) {
    console.log(err);
  }
  return {};
}

export function setCachedState(data: ViewOptionsState['data']) {
  setTimeout(() => {
    try {
      const str = JSON.stringify(data);
      window.localStorage.setItem(localStorageKey, str);
    } catch (err) {
      console.log(err);
    }
  }, 10);
}
