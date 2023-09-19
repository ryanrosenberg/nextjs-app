import Records from "./records-page";
import { db } from "../../lib/firestore";
import { collection, getDocs } from "firebase/firestore";

async function getData() {
  const querySnapshot = await getDocs(collection(db, "records"));
  var paths = [];
  querySnapshot.forEach((doc) => {
    paths[Number(doc.id.replace("record", ""))] = doc.data()["records"];
  });
  return {
    props: {
      result: paths,
    },
  };
}

export const metadata = {
  title: "Records | College Quizbowl Stats",
};

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <Records result={pageData} />;
}
