export function GetBaseRank({ page, index }: { page: number; index: number }) {
  return (page - 1) * 10 + index + 1;
}
