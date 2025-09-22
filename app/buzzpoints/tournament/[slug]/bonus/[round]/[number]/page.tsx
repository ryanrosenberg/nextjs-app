import BonusDisplay from "../../../../../../../components/BonusDisplay";
import Layout from "../../../../../../../components/Layout";
import { BonusDirect, BonusPart, BonusSummary, Round, Tournament } from "../../../../../../../types";
import { getNavOptions, removeTags, shortenAnswerline } from "../../../../../../../lib/utils";
import { sql, getTournamentBySlugQuery, getBonusPartsQuery, getDirectsByBonusQuery, getRoundsForTournamentQuery, getBonusSummaryBySite } from "../../../../../../../lib/queries";
import { Metadata } from "next";

export const generateStaticParams = () => {
    return [];
}

export async function generateMetadata(props: { params: Promise<{ slug:string, round:string, number:string }>}): Promise<Metadata> {
    const params = await props.params;
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const bonusParts = await sql(getBonusPartsQuery, [tournament.id, params.round, params.number]) as BonusPart[];

    return {
        title: `${removeTags(shortenAnswerline(bonusParts[0].answer))} - ${tournament.name} - Buzzpoints App`,
        description: `Bonus data for ${tournament!.name}`,
    };
}

export default async function BonusPage(props: { params: Promise<{ slug:string, round:string, number:string }>}) {
    const params = await props.params;
    const [tournament] = await sql(getTournamentBySlugQuery, [params.slug]) as Tournament[];
    const parts = await sql(getBonusPartsQuery, [tournament.id, params.round, params.number]) as BonusPart[];
    const directs = await sql(getDirectsByBonusQuery,[parts[0].id, tournament.id]) as BonusDirect[];
    const tournamentRounds = await sql(getRoundsForTournamentQuery, [tournament.id]) as Round[];
    const navOptions = getNavOptions(parseInt(params.round), parseInt(params.number), tournamentRounds);
    const bonusSummary = await sql(getBonusSummaryBySite, [parts[0].id]) as BonusSummary[];
    return (
        <Layout tournament={tournament}>
            <BonusDisplay 
                parts={parts} 
                directs={directs} 
                tournament={tournament} 
                navOptions={navOptions}
                bonusSummary={bonusSummary}
            />
        </Layout>
    );
}