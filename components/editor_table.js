import tables from "./tables.module.css";
import grouped_table from "./grouped_table.module.css"
import editor_styles from './editor_table.module.css';
import { useMemo } from "react";
import _ from "lodash";
import classnames from "classnames";

const EditorTable = ({ data }) => {
  const columns = useMemo(() => [
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      border: "right",
    },
    {
      Header: "Difficulty",
      accessor: "Difficulty",
      align: "left",
      border: "right",
    },
    {
      Header: "Head Editor",
      accessor: "Head Editor",
      align: "left",
      border: "right",
    },
    {
      Header: "Literature",
      accessor: "Literature",
      align: "left",
      border: "right",
    },
    {
      Header: "History",
      accessor: "History",
      align: "left",
      border: "right",
    },
    {
      Header: "Science",
      accessor: "Science",
      align: "left",
      border: "right",
    },
    {
      Header: "Arts",
      accessor: "Arts",
      align: "left",
      border: "right",
    },
    {
      Header: "Beliefs",
      accessor: "Beliefs",
      align: "left",
      border: "right",
    },
    {
      Header: "Thought",
      accessor: "Thought",
      align: "left",
      border: "right",
    },
    {
      Header: "Other",
      accessor: "Other",
      align: "left",
    },
  ]);

  const grouping_column = "Season";
  let rowGroups = _.groupBy(data, grouping_column);

  return (
    <div>
      <table className={editor_styles.EditorTable}>
        <thead className={tables.header}>
          <tr className={tables.headerRow}>
            {columns.map((column) => (
              <th
                className={classnames(
                  column.align == "left"
                    ? tables.headerCell
                    : tables.headerCellRight,
                  column.border == "right"
                    ? tables.borderRight
                    : tables.noBorder
                )}
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        {Object.keys(rowGroups).map((group) => {
          return (
            <tbody>
              <tr className={grouped_table.rowGroup}>
                <td
                  className={tables.cell}
                  colSpan={Object.keys(rowGroups[group][0]).length}
                >
                  {rowGroups[group][0][grouping_column]}
                </td>
              </tr>
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
                            <span
                              dangerouslySetInnerHTML={{
                                __html: row[column.accessor],
                              }}
                            />
                          </td>
                        ) : (
                          <td
                            className={classnames(
                              tables.cellRight,
                              column.border == "right"
                                ? tables.borderRight
                                : tables.noBorder
                            )}
                          >
                            <span
                              dangerouslySetInnerHTML={{
                                __html: row[column.accessor],
                              }}
                            />
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
};

export default EditorTable;
