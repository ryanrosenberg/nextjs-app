import SeasonsIndex from "./seasons-index";

export async function getData() {
  const sampleData = await fetch(
    "https://cqs-backend.herokuapp.com/seasons/champions"
  ).then((response) => response.json());
  return {
    props: {
      result: sampleData,
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
