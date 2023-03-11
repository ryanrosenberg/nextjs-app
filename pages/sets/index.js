import Head from "next/head";
import Layout from "../../components/layout";
import EditorTable from "../../components/editor_table";

export default function Home({ result }) {
  
  return (
    <Layout home>
      <Head>
        <title>Sets | College Quizbowl Stats</title>
      </Head>
      <div>
        <h1 className="page-title">Sets</h1>
        <EditorTable data = {result} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const editors = await fetch(
    "http://127.0.0.1:5000/sets/editors"
  ).then((response) => response.json());
  return {
    props: {
      result: editors
    },
  };
}
