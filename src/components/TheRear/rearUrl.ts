import type { MapName } from 'ff8';

const HAS_CLOSED_PARAM = 'hasClosed';
// Every param FF8 writes while URL sync is on (ff8 v0.1.2, useUrlSync and worldmapUrl)
const FF8_URL_PARAMS = ['field', 'party', 'progress', 'module', 'x', 'y', 'z', 'yaw', 'camera', 'vehicle', 'spawnPointId'];

const readSearchParams = () => new URLSearchParams(window.location.search);

const replaceSearchParams = (update: (params: URLSearchParams) => void) => {
  const url = new URL(window.location.href);
  update(url.searchParams);
  window.history.replaceState(window.history.state, '', url);
};

export const hasClosedInUrl = () => readSearchParams().has(HAS_CLOSED_PARAM);

export const getUrlField = () => (readSearchParams().get('field') as MapName | null) ?? undefined;

export const markClosedInUrl = () => replaceSearchParams((params) => params.set(HAS_CLOSED_PARAM, 'true'));

export const clearRearFromUrl = () =>
  replaceSearchParams((params) => [HAS_CLOSED_PARAM, ...FF8_URL_PARAMS].forEach((key) => params.delete(key)));
