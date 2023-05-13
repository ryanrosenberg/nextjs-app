import Home from "./home-page";

export async function getData() {
  const tty = await fetch(
    "https://cqs-backend.herokuapp.com/teams/thisyear"
  ).then((response) => response.json());
  const rt = await fetch(
    "https://cqs-backend.herokuapp.com/tournaments/recent"
  ).then((response) => response.json());
  return {
    props: {
      result: { teamsThisYear: tty, recentTournaments: rt },
    },
  };
}

export default async function Page() {
  // Fetch data directly in a Server Component
  const pageData = await getData();
  // Forward fetched data to your Client Component
  return <Home result={pageData} />;
}
