import Player from "./player-page";
import { db } from "../../../lib/firestore";
import { doc, getDoc } from "firebase/firestore";


export async function generateStaticParams() {
  // // Call an external API endpoint to get posts
  const res = await fetch("https://cqs-backend.herokuapp.com/players");
  const posts = await res.json();

  const paths = posts.map((post) => ({
    id: post.slug,
  }));

  return paths;
}

export async function generateMetadata({ params }) {
  const pageData = await getData(params);
  return {
    title: `${pageData.props.result.Years[0].Player} | College Quizbowl Stats`,
  };
}

export async function getData(params) {
  const docRef = doc(db, "players", params.id);
  const docSnap = await getDoc(docRef);

  return {
    props: {
      result: docSnap.data(),
    },
  };
}

export default async function Page({ params }) {
  // Fetch data directly in a Server Component
  const pageData = await getData(params);
  // Forward fetched data to your Client Component
  return <Player result={pageData} />;
}
