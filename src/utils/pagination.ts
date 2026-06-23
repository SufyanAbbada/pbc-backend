export const paginate = (
  totalCount: number,
  page: number | undefined,
  limit: number | undefined,
) => {
  if (page !== undefined && limit !== undefined) {
    return {
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      pageSize: limit,
    };
  }
  return undefined;
};
