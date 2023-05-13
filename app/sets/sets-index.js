'use client'

import Head from "next/head";
import Layout from "../../components/layout";
import EditorTable from "../../components/editor_table";

export default function SetsIndex({ result }) {
  const data = result.props.result;
  return (
    <Layout home>
      <Head>
        <title>Sets | College Quizbowl Stats</title>
      </Head>
      <div>
        <h1 className="page-title">Sets</h1>
        <EditorTable data = {data} />
      </div>
    </Layout>
  );
}