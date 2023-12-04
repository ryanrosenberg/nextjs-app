import tables from "./tables.module.css";
import _ from "lodash";
import * as ra from "radash";
import classnames from "classnames";
import Link from "next/link";
import { useSortableData } from "../hooks/useSortableData";
import tournaments from "./tournaments.module.css";

export default function StandingsTable({
  columns,
  data,
  grouping_column,
  full_width = null,
}) {
  const { items, requestSort, sortConfig } = useSortableData(data);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  let rowGroups = _.groupBy(items, grouping_column);

  const renderCell = (item, column) => {
    let cellValue = item[column.accessor];

    if (column.format) cellValue = column.format(cellValue);

    if (column.html)
      cellValue = <span dangerouslySetInnerHTML={{ __html: cellValue }}></span>;

    if (column.linkTemplate)
      return (
        <Link href={ra.template(column.linkTemplate, item)}>{cellValue}</Link>
      );

    return cellValue;
  };

  return (
    <div>
      <table
        id="myTable"
        className={classnames(
          tables.dataframe,
          full_width ? tables.fullWidth : tables.dataframe
        )}
      >
        <thead className={tables.header}>
          <tr className={tables.headerRow}>
            {columns.map((column, i) => (
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
                title={column.Tooltip}
                key={i}
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
        {Object.keys(rowGroups).map((group, i) => {
          return (
            <tbody className={tournaments.bracketGroups} key={i}>
              {rowGroups[group].map((row, i) => {
                return (
                  <tr key={i}>
                    {columns.map((column, i) => {
                      var rowHTML =
                        column.align == "left" ? (
                          <td
                            className={classnames(
                              tables.cell,
                              column.border == "right"
                                ? tables.borderRight
                                : tables.noBorder
                            )}
                            key={i}
                          >
                            {renderCell(row, column)}
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
                            key={i}
                          >
                            {renderCell(row, column)}
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
    </div>
  );
}
