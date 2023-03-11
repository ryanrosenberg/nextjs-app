import tables from "./tables.module.css";
import _ from "lodash";
import classnames from "classnames";
import RawHtml from "./rawHtml";
import { useSortableData } from "../hooks/useSortableData.js";

const NormalTable = ({ columns, data, className = null, footer = null, full_width = null }) => {
  const { items, requestSort, sortConfig } = useSortableData(data);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };
  return (
    <div>
      <table
        className={classnames(
          className,
          "sortable",
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
        <tbody>
          {items.map((row) => {
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
                          column.align == "center"
                            ? tables.cellCenter
                            : tables.cellRight,
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
        {footer && (
          <tfoot>
            <tr>
              <td colSpan={columns.length}>{footer}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default NormalTable;
