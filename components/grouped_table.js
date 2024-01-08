import tables from "./tables.module.css";
import group_tables from "./grouped_table.module.css";
import _ from "lodash";
import classnames from "classnames";
import { renderCell } from "../lib/utils";
import { useSortableData } from "../hooks/useSortableData";

export default function GroupedTable({
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
                title = {column.Tooltip}
                key = {i}
              >
                <button
                  className={classnames(
                    tables.headerButton,
                    tables[getClassNamesFor(column.Header)]
                  )}
                  onClick={() => requestSort(column.accessor)}
                >
                  {column.Header}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        {Object.keys(rowGroups).map((group, i) => {
          return (
            <tbody key={i}>
              <tr className={group_tables.rowGroup} key={i}>
                <td className={tables.cell} colSpan={columns.length} key={i}>
                  {renderCell(rowGroups[group][0], {'accessor': grouping_column, 'html': true})}
                </td>
              </tr>
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
