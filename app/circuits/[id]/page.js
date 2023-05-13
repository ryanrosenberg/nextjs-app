// Import your Client Component
import Circuit from "./circuit-page";

export async function generateStaticParams() {
  const res = await fetch("https://cqs-backend.herokuapp.com/circuits");
  const posts = await res.json();

  const paths = posts.map((post) => ({
    id: post.slug,
  }));
  
  return paths;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Tournaments[0]["Circuit"]} | College Quizbowl Stats`,
  };
}

async function getData(params) {
  const sampleData = await fetch(
    "https://cqs-backend.herokuapp.com/circuits/" + params.id
  ).then((response) => response.json());

  return {
    props: {
      result: sampleData,
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Circuit result={pageData} />;
}
