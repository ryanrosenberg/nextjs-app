import Head from "next/head";
import Layout from "../components/layout";

export default function Home({ result }) {
  
  return (
    <Layout home>
      <Head>
        <title>College Quizbowl Stats</title>
      </Head>
      <div>
        <h1 className="page-title">Page Not Found</h1>
        <p>Nothing here -- sorry!</p>
      </div>
    </Layout>
  );
}
