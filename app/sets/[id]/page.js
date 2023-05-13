import Set from "./set-page";

export const dynamicParams = false;


export async function generateStaticParams() {
  const res = await fetch("https://cqs-backend.herokuapp.com/sets");
  const posts = await res.json();

  const paths = posts.map((post) => ({
    id: post.set_slug,
  }));

  return paths;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: pageData.props.result.Summary[0].set_name + " | College Quizbowl Stats"
  };
}

export async function getData(params) {
  const sampleData = await fetch(
    "https://cqs-backend.herokuapp.com/sets/" + params.id
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
  return <Set result={pageData} />;
}
