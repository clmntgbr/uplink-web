export interface HydraView {
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
}

export interface Hydra<TData> {
  member: TData[];
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  view?: HydraView;
}

export const initHydra = <TData>(): Hydra<TData> => {
  return {
    member: [],
    currentPage: 0,
    itemsPerPage: 0,
    totalPages: 0,
    totalItems: 0,
  };
};
