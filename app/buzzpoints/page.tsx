import Layout from "../../components/Layout";
import Link from "next/link";

export default function Home() {
  return (
    <Layout>
      <div>
        Welcome to Buzzpoints! Click <Link href="/buzzpoints/tournament" className="underline">here to view stats by tournament</Link> or <Link href="/buzzpoints/set" className="underline">here to view stats by question set</Link>.
      </div>
    </Layout>
  );
}