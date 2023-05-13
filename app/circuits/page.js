import Head from "next/head";
import Layout from "../../components/layout";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>Seasons | College Quizbowl Stats</title>
      </Head>
      <div>
        <h1 className="page-title">Circuits</h1>
        <hr />
        <h2>Four-Year College Circuits</h2>
        <a href="../circuits/eastern-canada">Eastern Canada</a>{" "}
        <i>Toronto, McGill, McMaster…</i>
        <br />
        <a href="../circuits/great-lakes">Great Lakes</a>{" "}
        <i>Ohio State, Case Western, Michigan…</i>
        <br />
        <a href="../circuits/great-west">Great West</a>{" "}
        <i>Texas, Missouri, Oklahoma…</i>
        <br />
        <a href="../circuits/lower-mid-atlantic">Lower Mid-Atlantic</a>{" "}
        <i>Virginia, North Carolina, VCU…</i>
        <br />
        <a href="../circuits/midwest">Midwest</a>{" "}
        <i>Illinois, Northwestern, Purdue…</i>
        <br />
        <a href="../circuits/new-york">New York</a> <i>RIT, Cornell…</i>
        <br />
        <a href="../circuits/north">North</a> <i>Minnesota, Iowa…</i>
        <br />
        <a href="../circuits/northeast">Northeast</a>
        <i> Brown, Harvard, MIT…</i>
        <br />
        <a href="../circuits/northern-california">Northern California</a>{" "}
        <i>UC Berkeley, Stanford…</i>
        <br />
        <a href="../circuits/pacific-northwest">Pacific Northwest</a>{" "}
        <i>Washington, UBC…</i>
        <br />
        <a href="../circuits/southeast">Southeast</a>{" "}
        <i>Florida, Georgia Tech, Vanderbilt…</i>
        <br />
        <a href="../circuits/uk">UK</a> <i>Oxford, Cambridge, Imperial…</i>
        <br />
        <a href="../circuits/upper-mid-atlantic">Upper Mid-Atlantic</a>{" "}
        <i>Maryland, Columbia, Johns Hopkins…</i>
        <br />
        <h2>Community College Circuits</h2>
        <a href="../circuits/central-cc">Central CC</a>{" "}
        <i>Jefferson CTC, Cumberland…</i>
        <br />
        <a href="../circuits/florida-cc">Florida CC</a>{" "}
        <i>Valencia, Chipola College, SCF…</i>
        <br />
        <a href="../circuits/plains-cc">Plains CC</a>{" "}
        <i>Redlands CC, Lincoln Land, Rend Lake College…</i>
      </div>
    </Layout>
  );
}
