import Tournament from "./tournament-page";
import { db } from "../../../lib/firestore";
import { collection, getDocs } from "firebase/firestore";

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, "tournaments"));
  var paths = [];
  querySnapshot.forEach((doc) => {
    paths.push({ id: doc.id });
  });

  return paths;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Summary[0]["tournament_name"]} | College Quizbowl Stats`,
  };
}

async function getData(params) {
  const querySnapshot = await getDocs(
    collection(db, "tournaments", params.id, "results")
  );
  var paths = {};
  querySnapshot.forEach((doc) => {
    paths[doc.id] = doc.data()[doc.id];
  });
  return {
    props: {
      result: paths,
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Tournament result={pageData} />;
}
