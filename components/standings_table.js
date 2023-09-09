import tables from "./tables.module.css";
import _ from "lodash";
import classnames from "classnames";
import RawHtml from "../rawHtml";
import { useSortableData } from "../../hooks/useSortableData";
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
            <tbody className={tournaments.bracketGroups}>
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
    </div>
  );
}
