import Season from "./season-page";
import { db } from "../../../lib/firestore";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, "seasons"));
  var paths = [];
  querySnapshot.forEach((doc) => {
    paths.push({ id: doc.id });
  });

  return paths;
}

export async function generateMetadata({ params }) {
  return {
    title: `20${params.id} | College Quizbowl Stats`,
  };
}

async function getData(params) {
  const docRef = doc(db, "seasons", params.id);
  const docSnap = await getDoc(docRef);

  return {
    props: {
      result: docSnap.data(),
    },
  };
}

export default async function Page({ params }) {
  const pageData = await getData(params);

  return <Season result={pageData} />;
}
