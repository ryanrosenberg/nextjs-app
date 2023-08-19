import Home from "./home-page";
import { db } from "../lib/firestore";
import { doc, getDoc } from "firebase/firestore";

export const metadata = {
  title: "Home | College Quizbowl Stats",
};

export async function getData() {
  const rtRef = doc(db, "adhoc", "recent_tournaments");
  const rtSnap = await getDoc(rtRef);

  const ttyRef = doc(db, "adhoc", "teams_this_year");
  const ttySnap = await getDoc(ttyRef);

  return {
    props: {
      result: {
        teamsThisYear: ttySnap.data().Teams,
        recentTournaments: rtSnap.data().Tournaments,
      },
    },
  };
}

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <Home result={pageData} />;
}
