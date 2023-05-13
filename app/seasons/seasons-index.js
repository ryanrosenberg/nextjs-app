'use client'

import NormalTable from "../../components/normal_table";
import { useMemo } from "react";

export default function Home({ result }) {
  const data = result.props.result;
  const cols = useMemo(() => [
    {
      Header: "Season",
      accessor: "year",
      border: "right"
    },
    {
      Header: "ACF Nationals",
      accessor: "ACF Nationals",
      align: "left",
      border: "right"
    },
    {
      Header: "DI ICT",
      accessor: "DI ICT",
      align: "left"
    }
]);
  return (
    <>
      <div>
        <h1 className="page-title">Seasons</h1>
        <NormalTable data = {data} columns = {cols} />
      </div>
    </>
  );
}
