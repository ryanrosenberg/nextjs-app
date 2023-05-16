import Tournament from "./tournament-page";
import { db } from "../../../../lib/firestore";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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
    // title: `${pageData.props.result.Summary[0]["tournament_name"]} Team Detail | College Quizbowl Stats`,
    title: `${pageData.props.result.Summary[0]["tournament_name"]} Team Detail | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const summRef = doc(
    db,
    "tournaments",
    params.id,
    "results",
    "Summary"
  );
  const summSnap = await getDoc(summRef);
  const teamRef = doc(
    db,
    "tournaments",
    params.id,
    "results",
    "Player Detail"
  );
  const teamSnap = await getDoc(teamRef);

  const playerRef = doc(
    db,
    "tournaments",
    params.id,
    "results",
    "Players"
  );
  const playerSnap = await getDoc(playerRef);

  return {
    props: {
      result: {
        "Summary": summSnap.data()['Summary'],
        "Player Detail": teamSnap.data()['Player Detail'],
        "Players": playerSnap.data()['Players'],
      },
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Tournament result={pageData} />;
}
