import School from "./school-page";
import { db } from "../../../lib/firestore";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, "schools"));
  var paths = [];
  querySnapshot.forEach((doc) => {
    paths.push({ id: doc.id });
  });

  return paths;
}


export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Summary[0]['School']} | College Quizbowl Stats`
  };
}

async function getData(params) {
  const docRef = doc(db, "schools", params.id);
  const docSnap = await getDoc(docRef);

  return {
    props: {
      result: docSnap.data(),
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <School result={pageData} />;
}
