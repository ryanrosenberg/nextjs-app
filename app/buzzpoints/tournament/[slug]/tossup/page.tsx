import Layout from "../../../../../components/Layout";
import { TossupTable } from "../../../../../components/common/TossupTable";
import { Tossup, Tournament } from "../../../../../types";
import { sql, getTossupsByTournamentQuery, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const tournaments = await sql(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Tossups - Buzzpoints App`,
        description: `Tossup data for ${tournament!.name}`,
    };
}

export default async function TossupPage({ params }: { params: { slug: string } }) {
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const tossups = await sql(getTossupsByTournamentQuery, [tournament!.id]) as Tossup[];

    return <Layout tournament={tournament}>
        <TossupTable tossups={tossups} />
    </Layout>
}