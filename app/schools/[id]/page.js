import School from "./school-page";

export async function generateStaticParams() {
  // // Call an external API endpoint to get posts
  const res = await fetch("https://cqs-backend.herokuapp.com/teams");
  const posts = await res.json();

  const paths = posts.map((post) => ({
    id: post.slug,
  }));

  return paths;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Summary[0]['School']} | College Quizbowl Stats`
  };
}

export async function getData(params) {
  const sampleData = await fetch(
    "https://cqs-backend.herokuapp.com/teams/" + params.id
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
  return <School result={pageData} />;
}
