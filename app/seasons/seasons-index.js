'use client'

import Head from "next/head";
import Layout from "../../components/layout";
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
    <Layout home>
      <Head>
        <title>Seasons | College Quizbowl Stats</title>
      </Head>
      <div>
        <h1 className="page-title">Seasons</h1>
        <NormalTable data = {data} columns = {cols} />
      </div>
    </Layout>
  );
}
