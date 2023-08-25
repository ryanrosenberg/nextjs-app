import SeasonsIndex from "./seasons-index";
// import { db } from "../../lib/firestore";
// import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/database";
import { YearChampions } from "../../lib/kysely";

export async function getData() {
  // const docRef = doc(db, "adhoc", "champions");
  // const docSnap = await getDoc(docRef);

  // return {
  //   props: {
  //     result: docSnap.data().Champions,
  //   },
  // };
  const data = await db.selectFrom("champions").selectAll().execute();
  console.log(data);
  return {
    props: {
      result: data,
    },
  };
}

export const metadata = {
  title: "Seasons | College Quizbowl Stats",
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <SeasonsIndex result={pageData} />;
}
