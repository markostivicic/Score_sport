export function handleSort(
  newSelectedOrder,
  orderBy,
  sortOrder,
  setOrderBy,
  setSortOrder
) {
  if (newSelectedOrder !== orderBy) {
    setOrderBy(newSelectedOrder);
    setSortOrder("asc");
    return;
  }
  sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc");
}
