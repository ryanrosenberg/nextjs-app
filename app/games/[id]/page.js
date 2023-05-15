import Game from "./game-page";

export async function generateStaticParams() {
    return [];
  }
  
  export async function getData( params ) {
    const sampleData = await fetch(
      "https://cqs-backend.herokuapp.com/games/" + params.id
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
    return <Game result={pageData} />;
  }
  