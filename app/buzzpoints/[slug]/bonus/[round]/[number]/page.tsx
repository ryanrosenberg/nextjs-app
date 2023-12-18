import BonusDisplay from "../../../../../../components/BonusDisplay";
import Layout from "../../../../../../components/Layout";
import { Bonus, BonusDirect, BonusPart, Round, Tournament } from "../../../../../../types";
import { getNavOptions, removeTags, shortenAnswerline } from "../../../../../../lib/jordan_utils";
import { sql, getBonusesByTournamentQuery, getTournamentBySlugQuery, getTournamentsQuery, getBonusPartsQuery, getDirectsByBonusQuery, getRoundsForTournamentQuery } from "../../../../../../lib/queries";
import { Metadata } from "next";

export const generateStaticParams = () => {
    return [];
    // const tournaments = all<Tournament[]>(getTournamentsQuery);
    // const paths = [];

    // for (let { id, slug } of tournaments) {
    //     const bonuses = getBonusesByTournamentQuery.all(id) as Bonus[];

    //     for (let { round, question_number } of bonuses) {
    //         paths.push({
    //             slug,
    //             round: String(round),
    //             number: String(question_number)
    //         });
    //     }
    // }

    // return paths;
}

export async function generateMetadata({ params }: { params: { slug:string, round:string, number:string }}): Promise<Metadata> {
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const bonusParts = await sql(getBonusPartsQuery, [tournament.id, params.round, params.number]) as BonusPart[];
    
    return {
        title: `${removeTags(shortenAnswerline(bonusParts[0].answer))} - ${tournament.name} - Buzzpoints App`,
        description: `Bonus data for ${tournament!.name}`,
    };
}

export default async function BonusPage({ params }: { params: { slug:string, round:string, number:string }}) {
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const parts = await sql(getBonusPartsQuery, [tournament.id, params.round, params.number]) as BonusPart[];
    const directs = await sql(getDirectsByBonusQuery, [tournament.id, params.round, params.number]) as BonusDirect[];
    const tournamentRounds = await sql(getRoundsForTournamentQuery, [tournament.id]) as Round[];
    const navOptions = getNavOptions(parseInt(params.round), parseInt(params.number), tournamentRounds);
    
    return (
        <Layout tournament={tournament}>
            <BonusDisplay 
                parts={parts} 
                directs={directs} 
                tournament={tournament} 
                navOptions={navOptions}
            />
        </Layout>
    );
}