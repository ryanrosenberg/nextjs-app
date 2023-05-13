'use client'

import Layout from "../../../components/layout";
import Head from "next/head";
import { useMemo } from "react";
import _ from "lodash";
import GroupedPaginatedTable from "../../../components/grouped_paginated_table";
import NestedSideNav from "../../../components/nested_side_nav";
import NormalTable from "../../../components/normal_table";

export default function Season({ result }) {
  const data = result.props.result;
    const championsColumns = useMemo(() => [
        {
          Header: "Tournament",
          accessor: "Tournament",
          align: "left",
          border: "right"
        },
        {
          Header: "Site",
          accessor: "site",
          align: "left",
          border: "right"
        },
        {
          Header: "Team",
          accessor: "team",
          align: "left",
          border: "right"
        },
        {
          Header: "Players",
          accessor: "players",
          align: "left",
        }
    ]);
  
    const tournamentsColumns = useMemo(() => [
        {
          Header: "Tournament",
          accessor: "Tournament",
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
          Header: "Champion",
          accessor: "Champion",
        }
      ]);

      const setsColumns = useMemo(() => [
        {
          Header: "Set",
          accessor: "Set",
          align: "left",
          border: "right"
        },
        {
          Header: "Difficulty",
          accessor: "difficulty",
          align: "left",
          border: "right"
        },
        {
          Header: "Sites",
          accessor: "Sites",
        },
        {
          Header: "Teams",
          accessor: "Teams",
        },
        {
          Header: "Schools",
          accessor: "Schools"
        }
      ]);

    // switch(data.Summary[0].difficulty) {
    //     case 'easy':
    //         var diffdot = "<div class = 'diffdots easy-diff'>&#x25CF;</div>";
    //         break;
    //     case 'medium':
    //         var diffdot = "<div class = 'diffdots medium-diff'>&#x25CF;&#x25CF;</div>";
    //         break;
    //     case 'regionals':
    //         var diffdot = "<div class = 'diffdots regionals-diff'>&#x25CF;&#x25CF;&#x25CF;</div>";
    //         break;
    //     case 'nationals':
    //         var diffdot = "<div class = 'diffdots nationals-diff'>&#x25CF;&#x25CF;&#x25CF;&#x25CF;</div>";
    //         break;
    // }
    
    return (
      <Layout>
        <Head>
          <title>{data.Tournaments[0].year + " Season Summary | College Quizbowl Stats"}</title>
        </Head>
        <div className="main-container">
          <div className="side-nav">
            <NestedSideNav lowestLevel={3} />
          </div>
          <div className="main-content">
            <p className="page-title">{data.Tournaments[0].year}</p>
            <p className="page-subtitle"></p>
            <hr />
            <h2 id="editors">Champions</h2>
            <NormalTable
            data={data.Champions}
            columns = {championsColumns}
            />
            <hr />
            <h2 id="sets">Sets</h2>
            <NormalTable
              columns={setsColumns}
              data={data.Sets}
            />
            <hr />
            <h2 id="tournaments">Tournaments</h2>
            <GroupedPaginatedTable
              columns={tournamentsColumns}
              data={data.Tournaments}
              grouping_column = 'Date'
              itemsPerPage={10}
            />
          </div>
        </div>
      </Layout>
    );
  }
  
  export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    const res = await fetch("https://cqs-backend.herokuapp.com/seasons");
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
      "https://cqs-backend.herokuapp.com/seasons/" + params.id
    ).then((response) => response.json());
    return {
      props: {
        result: sampleData,
      },
    };
  }
  