import Head from "next/head";
import Layout from "../components/layout";
import Scoresheet from "../components/scoresheet";

export default function Page() {
    const finals1 = require('../sample.json');
    const finals2 = require('../sample2.json');
    const packet1 = require('../packet1.json');
    const packet2 = require('../packet2.json');
    return (
      <Layout home>
        <Head>
          <title>Scoresheet demo | College Quizbowl Stats</title>
        </Head>
        <div>
            <Scoresheet qbj={finals1} packet = {packet1}/>
            <hr></hr>
            <Scoresheet qbj={finals2} packet = {packet2} />
        </div>
      </Layout>
    );
  }
  
