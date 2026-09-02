import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function getSnapshot(): string {
  return window.location.search;
}

export function useUrlQuery(): URLSearchParams {
  const search = useSyncExternalStore(subscribe, getSnapshot);
  return new URLSearchParams(search);
}

export function updateUrlQuery(
  update: (params: URLSearchParams) => void,
  options?: { readonly replace?: boolean },
): void {
  const params = new URLSearchParams(window.location.search);
  update(params);
  const query = params.toString();
  const url = query === "" ? window.location.pathname : `${window.location.pathname}?${query}`;
  if (options?.replace === true) {
    window.history.replaceState(null, "", url);
  } else {
    window.history.pushState(null, "", url);
  }
  for (const listener of listeners) {
    listener();
  }
}
