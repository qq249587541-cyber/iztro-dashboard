// iztro CJS shim — esbuild can't statically analyze Object.defineProperty exports
// so we import the whole module and re-export the named parts
import iztro from 'iztro';

const iztroAny = iztro as any;

export const {
  astro,
  star,
  data,
  util,
  pattern,
  combination,
  qintian,
  nature,
  classical,
} = iztroAny;

// HoroscopeManager is available via astro namespace (re-exported via __exportStar in astro module)
export const { HoroscopeManager } = iztroAny.astro || {};

export type { IFunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe';
