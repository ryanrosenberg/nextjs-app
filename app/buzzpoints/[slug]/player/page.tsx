import Layout from "../../../../components/Layout";
import { PlayerTable } from "../../../../components/common/PlayerTable";
import { Tossup, Tournament } from "../../../../types";
import { sql, getPlayerLeaderboard, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const tournaments = await sql(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Players - Buzzpoints App`,
        description: `Player data for ${tournament!.name}`,
    };
}

export default async function PlayerPage({ params }: { params: { slug: string } }) {
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const players = await sql(getPlayerLeaderboard, [tournament!.id, tournament!.id]) as Tossup[];

    return <Layout tournament={tournament}>
        <PlayerTable players={players} />
    </Layout>
}