export default (
  total: number,
  query: Record<string, any>
): {
  page: number;
  limit: number;
  skip: number;
  pageCount: number;
  total: number;
} => {
  const page = parseInt(query.page || 1, 10);
  const limit = parseInt(query.limit || 10, 10);
  const skip = page === 1 ? 0 : page * limit - limit;
  const pageCount = Math.ceil(total / limit);

  return {
    page,
    limit,
    skip,
    pageCount,
    total
  };
};
