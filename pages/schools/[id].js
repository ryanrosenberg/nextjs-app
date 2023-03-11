import Layout from "../../components/layout";
import Head from "next/head";
import PaginatedTable from "../../components/paginated_table";
import GroupedPaginatedTable from "../../components/grouped_paginated_table";
import { useMemo } from "react";
import _ from "lodash";
import NestedSideNav from "../../components/nested_side_nav";
import NormalTable from "../../components/normal_table";

export default function Team({ result }) {
  const tournamentsColumns = useMemo(() => [
    {
      Header: "Team",
      accessor: "Team",
      align: "left",
      border: "right"
    },
    {
      Header: "Players",
      accessor: "Players",
      align: "left",
      border: "right"
    },
    {
      Header: "Finish",
      accessor: "Finish",
      border: "right"
    },
    {
      Header: "GP",
      accessor: "GP",
    },
    {
      Header: "W-L",
      accessor: "W-L",
    },
    {
      Header: "TUH",
      accessor: "TUH",
      border: "right"
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
      border: "right"
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
      border: "right"
    },
    {
      Header: "TU%",
      accessor: "TU%",
      border: "right"
    },
    {
      Header: "PPG",
      accessor: "PPG",
    },
    {
      Header: "PPB",
      accessor: "PPB",
      border: "right"
    },
    {
      Header: "A-Value",
      accessor: "A-Value",
    },
  ]);

  const teamsColumns = useMemo(() => [
    {
      Header: "Team",
      accessor: "Team",
      align: "left",
      border: "right"
    },
    {
      Header: "Tmnts",
      accessor: "Tmnts",
      border: "right"
    },
    {
      Header: "GP",
      accessor: "GP",
    },
    {
      Header: "TUH",
      accessor: "TUH",
      border: "right"
    },
    {
      Header: "W-L",
      accessor: "W-L",
    },
    {
      Header: "Win%",
      accessor: "Win%",
      border: "right"
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
      border: "right"
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
      border: "right"
    },
    {
      Header: "TU%",
      accessor: "TU%",
      border: "right"
    },
    {
      Header: "PPG",
      accessor: "PPG",
    },
    {
      Header: "PPB",
      accessor: "PPB",
    },
  ]);

  const playersColumns = useMemo(() => [
    {
      Header: "Player",
      accessor: "Player",
      align: "left",
      border: "right"
    },
    {
      Header: "Yrs",
      accessor: "Yrs",
      border: "right"
    },
    {
      Header: "Tmnts",
      accessor: "Tmnts",
    },
    {
      Header: "GP",
      accessor: "GP",
    },
    {
      Header: "TUH",
      accessor: "TUH",
      border: "right"
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
      border: "right"
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
      border: "right"
    },
    {
      Header: "TU%",
      accessor: "TU%",
      border: "right"
    },
    {
      Header: "PPG",
      accessor: "PPG",
    },
  ]);

  const hostingColumns = useMemo(() => [
    {
      Header: "Date",
      accessor: "Date",
      border: "right"
    },
    {
      Header: "Set",
      accessor: "Set",
      align: "left",
      border: "right"
    },
    {
      Header: "Teams",
      accessor: "Teams",
    },
  ]);

  const yearsColumns = useMemo(() => [
    {
      Header: "Year",
      accessor: "Year",
      border: "right"
    },
    {
      Header: "Tmnts",
      accessor: "Tmnts",
      border: "right"
    },
    {
      Header: "Teams",
      accessor: "Teams",
    },
    {
      Header: "Players",
      accessor: "Players",
      border: "right"
    },
    {
      Header: "ACF Nationals",
      accessor: "ACF Nats",
    },
    {
      Header: "DI ICT",
      accessor: "DI ICT",
    }
  ]);

  return (
    <Layout>
      <Head>
        <title>{result.Summary[0].School + " | College Quizbowl Stats"}</title>
      </Head>
      <div className="main-container">
        <NestedSideNav lowestLevel={3} />
        <div className="main-content">
          <h1 className="page-title">{result.Summary[0].School}</h1>
          <p className="page-subtitle">{result.Summary[0].Circuit}</p>
          <hr />
          <h2 id="years">Years</h2>
          <NormalTable
            columns={yearsColumns}
            data={result.Summary}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="teams">Teams</h2>
          <PaginatedTable
            columns={teamsColumns}
            data={result.Teams}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="players">Players</h2>
          <PaginatedTable
            columns={playersColumns}
            data={result.Players}
            itemsPerPage={10}
          />
          <hr />
          <h2 id="tournaments">Tournaments</h2>
          <GroupedPaginatedTable
            columns={tournamentsColumns}
            data={result.Tournaments}
            itemsPerPage={10}
            grouping_column="Tournament"
          />
          {result.Hosting.length > 0 && (
            <div>
              <hr />
              <h2 id="hosting">Hosting</h2>
              <GroupedPaginatedTable
                columns={hostingColumns}
                data={result.Hosting}
                itemsPerPage={10}
                grouping_column="Year"
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("http://127.0.0.1:5000/teams");
  const posts = await res.json();

  // Get the paths we want to prerender based on posts
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)
  const paths = posts.map((post) => ({
    params: { id: post.slug },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const sampleData = await fetch(
    "http://127.0.0.1:5000/teams/" + params.id
  ).then((response) => response.json());
  return {
    props: {
      result: sampleData,
    },
  };
}
