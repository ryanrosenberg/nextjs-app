import SetsIndex from "./sets-index";

export const dynamicParams = false;

export async function getData() {
  const editors = await fetch(
    "https://cqs-backend.herokuapp.com/sets/editors"
  ).then((response) => response.json());
  return {
    props: {
      result: editors
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
