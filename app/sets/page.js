import SetsIndex from "./sets-index";
import { db } from "../../lib/firestore";
import { doc, getDoc } from "firebase/firestore";

export const dynamicParams = false;

export async function getData() {
  const docRef = doc(db, "adhoc", "editors");
  const docSnap = await getDoc(docRef);

  return {
    props: {
      result: docSnap.data().Editors,
    },
  };
}

export const metadata = {
  title: "Sets | College Quizbowl Stats",
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <SetsIndex result={pageData} />;
}
