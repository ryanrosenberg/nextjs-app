import tables from "./tables.module.css";
import grouped_table from "./grouped_table.module.css";
import _ from "lodash";
import classnames from "classnames";
import { renderCell } from "../lib/utils";

const SpreadTable = ({ data, columns, grouping_column, spread_column }) => {
    const spread_values = [...new Set(data.map((item) => (item[spread_column])))];
    const index_columns = columns.map((item) => (item.accessor))
    console.log(index_columns);
    const new_columns = columns.concat(spread_values.map((item) => (
        {
            Header: item,
            accessor: item,
            border: "right"
        })))
    let rowGroups = _.groupBy(data, grouping_column);
    return (
        <div>
            <table className={tables.dataframe}>
                <thead className={tables.header}>
                    <tr className={tables.headerRow}>
                        {new_columns.map((column, i) => (
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
                                    colSpan={new_columns.length}
                                >
                                    {rowGroups[group][0][grouping_column]}
                                </td>
                            </tr>
                            <tr key={i}>
                                {_.map(
                                    new_columns,
                                    (column, i) => {
                                        console.log(column.accessor);
                                        console.log(rowGroups[group].filter((row) => row[spread_column] === column.accessor));
                                        return (
                                            <td key={i} className={column.border == "right" ? tables.borderRight : tables.noBorder}>
                                                {index_columns.includes(column.accessor) ?
                                                    renderCell(rowGroups[group][0], column) :
                                                    rowGroups[group].filter((row) => row[spread_column] === column.accessor).length > 0 ?
                                                    rowGroups[group].filter((row) => row[spread_column] === column.accessor)[0].pts :
                                                    '0'}
                                            </td>
                                        )
                                    }
                                )}
                            </tr>
                        </tbody>
                    );
                })}
            </table>
        </div>
    );
};

export default SpreadTable;
