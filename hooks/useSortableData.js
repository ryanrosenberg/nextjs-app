"use client";
import { useState, useMemo } from "react";

export const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  console.log(sortConfig);
  console.log(items);
  const sortedItems = useMemo(() => {
    let sortableItems = [...items];

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const regex = /^[0-9\.]+$/g;
        if (typeof a[sortConfig.key] == "string" && a[sortConfig.key].match(regex)) {
          if (parseFloat(a[sortConfig.key]) < parseFloat(b[sortConfig.key])) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (parseFloat(a[sortConfig.key]) > parseFloat(b[sortConfig.key])) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        }
      });
      // sorted.sort((a, b) => {
      //   let valueOne = a[sortConfig.key];
      //   let valueTwo = b[sortConfig.key];

      //   if (valueOne == null && valueTwo == null) return 0;
      //   if (valueOne == null) return sortConfig.direction === "ascending" ? 1 : -1;
      //   if (valueTwo == null) return sortConfig.direction === "ascending" ? -1 : 1;
      //   if (valueOne === valueTwo) return 0;

      //   return valueOne > valueTwo ? 1 : -1;
      // });

      // if (sortConfig.direction === "descending")
      //   sorted.reverse();
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
