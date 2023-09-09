import tables from "./tables.module.css";
import group_tables from "./grouped_table.module.css";
import _ from "lodash";
import classnames from "classnames";
import RawHtml from "./rawHtml";
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
  // columns = columns.filter(column => column.accessor != grouping_column)
  let rowGroups = _.groupBy(items, grouping_column);

  // if(grouping_column == 'category'){
  //   rowGroups = {
  //     'Literature': rowGroups['Literature'],
  //     'History': rowGroups['History'],
  //     'Science': rowGroups['Science'],
  //     'Arts': rowGroups['Arts'],
  //     'Beliefs': rowGroups['Beliefs'],
  //     'Thought': rowGroups['Thought'],
  //     'Other': rowGroups['Other'],
  //   }
  // }

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
            <tbody key = {i}>
              <tr className={group_tables.rowGroup}>
                <td className={tables.cell} colSpan={columns.length}>
                  <RawHtml html={rowGroups[group][0][grouping_column]} />
                </td>
              </tr>
              {rowGroups[group].map((row, i) => {
                return (
                  <tr key = {i}>
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
                            key = {i}
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
    </div>
  );
}
