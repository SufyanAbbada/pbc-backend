export const calculatePaginationSkip = (page?: number, limit?: number) => {
  return page !== undefined && limit !== undefined
    ? (page - 1) * limit
    : undefined;
};
