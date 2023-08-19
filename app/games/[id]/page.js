import Game from "./game-page";
import { db } from "../../../lib/firestore";
import { doc, getDoc } from "firebase/firestore";

export async function generateStaticParams() {
    return [];
  }
  
  export async function getData( params ) {
    console.log(params.id)
    const docRef = doc(db, "dev_games", params.id);
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());
    // const sampleData = await fetch(
    //   "https://cqs-backend.herokuapp.com/games/" + params.id
    // ).then((response) => response.json());
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
    return <Game result={pageData} />;
  }
  