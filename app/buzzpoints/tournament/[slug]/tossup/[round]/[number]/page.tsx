import Layout from "../../../../../../../components/Layout";
import { sql, getBuzzesByTossupQuery, getRoundsForTournamentQuery, getTossupForDetailQuery, getTournamentBySlugQuery, getTossupSummaryBySite } from "../../../../../../../lib/queries";
import { Buzz, Round, Tossup, TossupSummary, Tournament } from "../../../../../../../types";
import TossupDisplay from "../../../../../../../components/TossupDisplay";
import { Metadata } from "next";
import { getNavOptions, removeTags, shortenAnswerline } from "../../../../../../../lib/utils";

export const generateStaticParams = () => {
    return [];
}

export async function generateMetadata(
    props: { params: Promise<{ slug: string, round: string, number: string }> }
): Promise<Metadata> {
    const params = await props.params;
    const [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const [tossup] = await sql.query(getTossupForDetailQuery, [tournament.id, params.round, params.number]);

    return {
        title: `${removeTags(shortenAnswerline(tossup.answer))} - ${tournament.name} - Buzzpoints App`,
        description: `Tossup data for ${tournament!.name}`,
    };
}

export default async function TossupPage(
    props: { params: Promise<{ slug: string, round: string, number: string }> }
) {
    const params = await props.params;
    const [tournament] = await sql.query(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const [tossup] = await sql.query(getTossupForDetailQuery, [tournament.id, params.round, params.number]) as Tossup[];
    const buzzes = await sql.query(getBuzzesByTossupQuery, [tossup.id, tournament.id]) as Buzz[];
    const tournamentRounds = await sql.query(getRoundsForTournamentQuery, [tournament.id]) as Round[];
    const navOptions = getNavOptions(parseInt(params.round), parseInt(params.number), tournamentRounds);
    const tossupSummary = await sql.query(getTossupSummaryBySite,[
        tossup.id, 
        tournament.question_set_id, 
        tossup.metadata, 
        tossup.answer_primary, 
        tossup.question
    ]) as TossupSummary[];

    return (
        <div>
            <Layout tournament={tournament}>
                <TossupDisplay
                    tossup={tossup}
                    buzzes={buzzes}
                    tournament={tournament}
                    navOptions={navOptions}
                    tossupSummary={tossupSummary}
                />
            </Layout>
        </div>
    );
}