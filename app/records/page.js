import Records from "./records-page";

export async function getData() {
  const records = await fetch("https://cqs-backend.herokuapp.com/records").then(
    (response) => response.json()
  );

  return {
    props: {
      result: records,
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
