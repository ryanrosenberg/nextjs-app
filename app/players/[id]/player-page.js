'use client'

import Layout from "../../../components/layout";
import Head from "next/head";
import { useMemo } from "react";
import _ from "lodash";
import Link from "next/link";
import { slug } from "../../../lib/utils.js";
import RawHtml from "../../../components/rawHtml";
import GroupedTable from "../../../components/grouped_table";
import NestedSideNav from "../../../components/nested_side_nav";

export default function Player({ result }) {
  const data = result.props.result;
  const yearsColumns = useMemo(
    () => [
      {
        Header: "Season",
        accessor: "Year",
        border: "right",
      },
      {
        Header: "School",
        accessor: "School",
        align: "left",
        border: "right",
        render: ({ val }) => (
          <Link href={"../schools/" + slug(val)}>{val}</Link>
        ),
      },
      {
        Header: "Ts",
        accessor: "Ts",
      },
      {
        Header: "GP",
        accessor: "GP",
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
      },
      {
        Header: "10/G",
        accessor: "10/G",
      },
      {
        Header: "-5/G",
        accessor: "-5/G",
        border: "right",
      },
      {
        Header: "PPG",
        accessor: "PPG",
      },
    ],
    []
  );

  const tournamentsColumns = useMemo(() => [
    {
      Header: "Date",
      accessor: "Date",
      border: "right",
    },
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
    },
    {
      Header: "Site",
      accessor: "Site",
      align: "left",
      border: "right",
    },
    {
      Header: "School",
      accessor: "School",
      align: "left",
    },
    {
      Header: "Team",
      accessor: "Team",
      align: "left",
      border: "right",
    },
    {
      Header: "Finish",
      accessor: "Finish",
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
    },
    {
      Header: "10/G",
      accessor: "10/G",
    },
    {
      Header: "-5/G",
      accessor: "-5/G",
      border: "right",
    },
    {
      Header: "P/N",
      accessor: "P/N",
    },
    {
      Header: "G/N",
      accessor: "G/N",
      border: "right",
    },
    {
      Header: "PPG",
      accessor: "PPG",
    },
  ]);

  const editingColumns = useMemo(() => [
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      border: "right",
    },
    {
      Header: "Categories",
      accessor: "Categories",
      align: "left",
    },
  ]);

  const subtitle = _.map(data.Years, "School")
    .filter((v, i, a) => a.indexOf(v) == i)
    .map((school, i) => (
      <span key={i}>
        {i > 0 && ", "}
        <RawHtml html={school} />
      </span>
    ));

  return (
    <Layout>
      <Head>
        <title>{data.Years[0].Player + " | College Quizbowl Stats"}</title>
      </Head>
      <div className="main-container">
        <div className="side-nav">
          <NestedSideNav />
        </div>
        <div className="main-content">
          <h1 className="page-title">{data.Years[0].Player}</h1>
          <p className="page-subtitle">{subtitle}</p>
          <hr />
          <h2 id="years">Years</h2>
          <GroupedTable
            columns={yearsColumns}
            data={data.Years}
            grouping_column="School"
          />
          <hr />
          <h2 id="tournaments">Tournaments</h2>
          <GroupedTable
            columns={tournamentsColumns}
            data={data.Tournaments}
            grouping_column="Year"
          />
          {data.Editing.length > 0 && (
            <div>
              <hr />
              <h2 id="editing">Editing</h2>
              <GroupedTable
                columns={editingColumns}
                data={data.Editing}
                grouping_column="Year"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

