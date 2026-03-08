import { motifSearch, complementsSearch } from '@rnacanvas/search';

import type { Iterated } from './Iterated';

export type HitParameters = (
  Iterated<ReturnType<typeof motifSearch>>
  | Iterated<ReturnType<typeof complementsSearch>>
);
