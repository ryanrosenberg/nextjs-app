import Layout from "../../components/layout";
import Head from "next/head";
import { useMemo } from "react";
import _ from "lodash";
import SideNav from "../../components/side_nav";
import GroupedTable from "../../components/grouped_table";
import PaginatedTable from "../../components/paginated_table";
import NestedSideNav from "../../components/nested_side_nav";

export default function Set({ result }) {
    const tournamentsColumns = useMemo(() => [
      {
        Header: "Site",
        accessor: "Site",
        align: "left",
        border: "right"
      },
      {
        Header: "Teams",
        accessor: "Teams",
      },
      {
        Header: "Schools",
        accessor: "Schools",
        border: "right"
      },
      {
        Header: "15%",
        accessor: "15%",
      },
      {
        Header: "Conv%",
        accessor: "Conv%",
        border: "right"
      },
      {
        Header: "PPB",
        accessor: "PPB",
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
        Header: "Site",
        accessor: "Site",
        border: "right",
        datatype: "string"
      },
      {
        Header: "GP",
        accessor: "GP",
      },
      {
        Header: "W-L",
        accessor: "W-L",
        border: "right"
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
  
    const playersColumns = useMemo(() => [
      {
        Header: "Player",
        accessor: "Player",
        align: "left",
        border: "right",
        html: "True"
      },
      {
        Header: "School",
        accessor: "Team",
        border: "right",
        datatype: "string"
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
        Header: "P/N",
        accessor: "P/N",
      },
      {
        Header: "G/N",
        accessor: "G/N",
        border: "right"
      },
      {
        Header: "PPG",
        accessor: "PPG",
      },
    ]);
  
    const editorsColumns = useMemo(() => [
      {
        Header: "Subcategory",
        accessor: "Subcategory",
        align: "left",
        border: "right"
      },
      {
        Header: "Editors",
        accessor: "Editor",
        align: "left",
      }
    ]);

    switch(result.Summary[0].difficulty) {
        case 'easy':
            var diffdot = "<div class = 'diffdots easy-diff'>&#x25CF;</div>";
            break;
        case 'medium':
            var diffdot = "<div class = 'diffdots medium-diff'>&#x25CF;&#x25CF;</div>";
            break;
        case 'regionals':
            var diffdot = "<div class = 'diffdots regionals-diff'>&#x25CF;&#x25CF;&#x25CF;</div>";
            break;
        case 'nationals':
            var diffdot = "<div class = 'diffdots nationals-diff'>&#x25CF;&#x25CF;&#x25CF;&#x25CF;</div>";
            break;
    }
    
    return (
      <Layout>
        <Head>
          <title>{result.Summary[0].set_name + " | College Quizbowl Stats"}</title>
        </Head>
        <div className="main-container">
          <div className="side-nav">
            <NestedSideNav lowestLevel={3} />
          </div>
          {/* <SideNav
            headers={
              ["Editors", "Tournaments", "Teams", "Players"]
            }
          /> */}
          <div className="main-content">
            <div className="page-title">{result.Summary[0].set_name + ' '}<div style = {{display:'inline'}} dangerouslySetInnerHTML={{__html:diffdot}}></div></div>
            <p className="page-subtitle">Head Editor: {result.Summary[0].headitor}</p>
            <hr />
            <h2 id="editors">Editors</h2>
            <GroupedTable
              columns={editorsColumns}
              data={result.Editors}
              grouping_column = 'category'
            />
            <hr />
            <h2 id="tournaments">Tournaments</h2>
            <GroupedTable
              columns={tournamentsColumns}
              data={result.Tournaments}
              grouping_column = 'Date'
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
          </div>
        </div>
      </Layout>
    );
  }
  
  export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch("http://127.0.0.1:5000/sets");
    const posts = await res.json();
  
    // Get the paths we want to prerender based on posts
    // In production environments, prerender all pages
    // (slower builds, but faster initial page load)
    const paths = posts.map((post) => ({
      params: { id: post.set_slug },
    }));
  
    // { fallback: false } means other routes should 404
    return { paths, fallback: false };
  }
  
  export async function getStaticProps({ params }) {
    const sampleData = await fetch(
      "http://127.0.0.1:5000/sets/" + params.id
    ).then((response) => response.json());
    return {
      props: {
        result: sampleData,
      },
    };
  }
  