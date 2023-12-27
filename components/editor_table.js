import tables from "./tables.module.css";
import grouped_table from "./grouped_table.module.css"
import editor_styles from './editor_table.module.css';
import { useMemo } from "react";
import _ from "lodash";
import classnames from "classnames";
import { renderCell } from "../lib/utils";

const EditorTable = ({ data }) => {
  
  const columns = useMemo(() => [
    {
      Header: "Set",
      accessor: "set",
      align: "left",
      border: "right",
      linkTemplate: "/sets/{{set_slug}}"
    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      align: "left",
      border: "right",
      html: 'true'
    },
    {
      Header: "Head Editor",
      accessor: "Head",
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

  const makeEditorLink = (row) => {
    const set = row[0]
    if (set) {
      if (set.editors){
        let editor_list = set.editors.split('; ').map((item) => item.split(',,'))
        let link_list = editor_list.map((item, i) => `<a href = '/players/${item[1]}'>${item[0]}</a> <i style="font-size:80%">${item[2]}</i>`)
        return link_list.join('<br>')
      }
    } else {
      return ''
    }
  };

  const grouping_column = "season";
  let rowGroups = _.groupBy(data, grouping_column);
  return (
    <div>
      <table className={editor_styles.EditorTable}>
        <thead className={tables.header}>
          <tr className={tables.headerRow}>
            {columns.map((column, i) => (
              <th
                className={classnames(
                  column.align == "left"
                    ? tables.headerCell
                    : tables.headerCellRight,
                  column.border == "right"
                    ? tables.borderRight
                    : tables.noBorder
                )}
                key={i}
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        {Object.keys(rowGroups).map((group, i) => {
          return (
            <tbody key={i}>
              <tr className={grouped_table.rowGroup} key={i}>
                <td
                  className={tables.cell}
                  colSpan={columns.length}
                >
                  {rowGroups[group][0][grouping_column]}
                </td>
              </tr>
              {_.map(
                _.groupBy(rowGroups[group], "set"),
                (set_rows, i) => {
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
                              {
                                column.accessor === "set" | column.accessor === "difficulty" ?
                                  renderCell(set_rows[0], column) :
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: makeEditorLink(set_rows.filter((set_row) => set_row.category === column.accessor)),
                                    }}
                                  />
                              }
                            </td>
                          ) : (
                            <td
                              className={classnames(
                                tables.cellRight,
                                column.border == "right"
                                  ? tables.borderRight
                                  : tables.noBorder
                              )}
                              key={i}
                            >
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: column.accessor === "set" | column.accessor === "Difficulty" ?
                                    renderCell(set_rows[0], column) :
                                    makeEditorLink(set_rows.filter((set_row) => set_row.category === column.accessor)),
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
