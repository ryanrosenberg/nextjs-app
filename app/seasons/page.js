import SeasonsIndex from "./seasons-index";

export async function getData() {
  const docRef = doc(db, "adhoc", "champions");
  const docSnap = await getDoc(docRef);

  return {
    props: {
      result: docSnap.data().Champions,
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
