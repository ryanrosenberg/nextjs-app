import Layout from "../../../../components/Layout";
import { TeamTable } from "../../../../components/common/TeamTable";
import { Tossup, Tournament } from "../../../../types";
import { sql, getTeamLeaderboard, getTournamentBySlugQuery, getTournamentsQuery } from "../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const tournaments = await sql(getTournamentsQuery) as Tournament[];

    return tournaments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];

    return {
        title: `${tournament.name} Teams - Buzzpoints App`,
        description: `Team data for ${tournament!.name}`,
    };
}

export default async function TeamPage({ params }: { params: { slug: string } }) {
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const teams = await sql(getTeamLeaderboard, [tournament!.id, tournament!.id]) as Tossup[];

    return <Layout tournament={tournament}>
        <TeamTable teams={teams} />
    </Layout>
}
