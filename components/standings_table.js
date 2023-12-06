"use client";

import tables from "./tables.module.css";
import _ from "lodash";
import classnames from "classnames";
import { useSortableData } from "../hooks/useSortableData";
import tournaments from "./tournaments.module.css";
import { renderCell, formatDecimal, formatPercent } from "../lib/utils";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function StandingsTable({
  data,
  grouping_column,
  full_width = null,
}) {
  const pathname = usePathname();
  const { items, requestSort, sortConfig } = useSortableData(data);

  const columns = useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "rank",
        border: "right",
      },
      {
        Header: "Team",
        accessor: "team",
        align: "left",
        border: "right",
        linkTemplate: pathname + "/team-detail#{{team_slug}}",
      },
      {
        Header: "School",
        accessor: "school",
        align: "left",
        border: "right",
        linkTemplate: "/schools/{{slug}}",
      },
      {
        Header: "GP",
        accessor: "gp",
      },
      {
        Header: "W-L",
        accessor: "W-L",
      },
      {
        Header: "TUH",
        accessor: "tuh",
        border: "right",
      },
      {
        Header: "15",
        accessor: "15",
      },
      {
        Header: "10",
        accessor: "10",
      },
      {
        Header: "-5",
        accessor: "-5",
        border: "right",
      },
      {
        Header: "15/G",
        accessor: "15/G",
        format: formatDecimal,
      },
      {
        Header: "10/G",
        accessor: "10/G",
        format: formatDecimal,
      },
      {
        Header: "-5/G",
        accessor: "-5/G",
        border: "right",
        format: formatDecimal,
      },
      {
        Header: "TU%",
        accessor: "TU%",
        format: formatPercent,
      },
      {
        Header: "PPG",
        accessor: "ppg",
        format: formatDecimal,
      },
      {
        Header: "PPB",
        accessor: "ppb",
        format: formatDecimal,
        border: "right",
      },
      {
        Header: "A-Value",
        accessor: "A-Value",
        format: formatDecimal,
        Tooltip:
          "A-Value is a measure of a team's performance on a set compared to all other teams that played the set. It approximates how many points a team would be expected to score against the average team playing the set.",
      },
    ],
    []
  );

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
