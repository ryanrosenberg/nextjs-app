"use client";

import tables from "./tables.module.css";
import Link from "next/link";
import * as _ from 'radash';
import classnames from "classnames";
import RawHtml from "./rawHtml";
import { useSortableData } from "../hooks/useSortableData.js";

const NormalTable = ({
  columns,
  data,
  className = null,
  footer = null,
  full_width = null,
}) => {
  const { items, requestSort, sortConfig } = useSortableData(data);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const renderCell = (item, column) => {
    let cellValue = item[column.accessor];

    if (column.render)
      return column.render(item);  

    if (column.format)
      cellValue = column.format(cellValue);

    if (column.html)
      cellValue = <span dangerouslySetInnerHTML={{ __html: cellValue }}></span>;
    
    if (column.linkTemplate)
      return <Link href={_.template(column.linkTemplate, item)} className="underline">{cellValue}</Link>;

    return cellValue;
  }
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
                  onClick={() => {
                    requestSort(column.accessor)
                  }}
                >
                  {column.Header}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((row, i) => {
            return (
              <tr key={i}>
                {columns.map((column, i) => {
                  var rowHTML =
                    column.align == "left" ? (
                      <td
                        key={i}
                        className={classnames(
                          tables.cell,
                          column.border == "right"
                            ? tables.borderRight
                            : tables.noBorder
                        )}
                      >
                        <RawHtml html={renderCell(row, column)} />
                      </td>
                    ) : (
                      <td
                        key={i}
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
                        <RawHtml html={renderCell(row, column)} />
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
