import Game from "./game-page";
import { db } from "../../../lib/firestore";
import { doc, getDoc } from "firebase/firestore";

export async function generateStaticParams() {
    return [];
  }
  
  export async function getData( params ) {
    const docRef = doc(db, "games", params.id);
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
    return <Game result={pageData} />;
  }
  