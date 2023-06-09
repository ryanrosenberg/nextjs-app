import { useState } from "react";
import tables from "./tables.module.css";
import paginated_table from "./paginated_table.module.css";
import ReactPaginate from "react-paginate";
import { useSortableData } from "../hooks/useSortableData";
import _ from "lodash";
import classnames from "classnames";
import RawHtml from "./rawHtml";

const PaginatedTable = ({
  columns,
  data,
  itemsPerPage,
  grouping_column,
  full_width = null,
}) => {
  const { items, requestSort, sortConfig } = useSortableData(data);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [page, setPage] = useState(1);
  const [itemOffset, setItemOffset] = useState(0);

  // Simulate fetching items from another resources.
  // (This could be items from props; or items loaded in a local state
  // from an API endpoint with useEffect and useState)
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  let rowGroups = _.groupBy(currentItems, grouping_column);

  return (
    <div>
      <table
        className={classnames(
          tables.dataframe,
          full_width ? tables.fullWidth : tables.dataframe
        )}
      >
        <thead className={tables.header}>
          <tr className={tables.headerRow}>
            {columns.map((column) => (
              <th
                className={classnames(
                  tables.tableHeader,
                  column.align == "left"
                    ? tables.headerCell
                    : tables.headerCellRight,
                  column.border == "right"
                    ? tables.borderRight
                    : tables.noBorder
                )}
                title = {column.Tooltip}
              >
                <button
                  className={classnames(
                    tables.headerButton,
                    tables[getClassNamesFor(column.Header)]
                  )}
                  onClick={() => requestSort(column.Header)}
                >
                  {column.Header}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        {Object.keys(rowGroups).map((group) => {
          return (
            <tbody>
              {rowGroups[group].map((row, i) => {
                return (
                  <tr>
                    {columns.map((column) => {
                      var rowHTML =
                        column.align == "left" ? (
                          <td
                            className={classnames(
                              tables.cell,
                              column.border == "right"
                                ? tables.borderRight
                                : tables.noBorder
                            )}
                          >
                            <RawHtml html={row[column.accessor]} />
                          </td>
                        ) : (
                          <td
                            className={classnames(
                              tables.cellRight,
                              column.border == "right"
                                ? tables.borderRight
                                : tables.noBorder,
                              column.datatype == "string"
                                ? tables.cellRight
                                : tables.cellNumber
                            )}
                          >
                            <RawHtml html={row[column.accessor]} />
                          </td>
                        );
                      return rowHTML;
                    })}
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Previous"
        renderOnZeroPageCount={null}
        className={paginated_table.paginationControl}
        pageClassName={paginated_table.button}
        pageLinkClassName={paginated_table.buttonLink}
        previousClassName={paginated_table.button}
        previousLinkClassName={paginated_table.buttonLink}
        disabledLinkClassName={paginated_table.inactiveButton}
        nextClassName={paginated_table.button}
        nextLinkClassName={paginated_table.buttonLink}
        breakClassName={paginated_table.button}
        breakLinkClassName={paginated_table.buttonLink}
        activeClassName={paginated_table.activeButton}
      />
    </div>
  );
};

export default PaginatedTable;
