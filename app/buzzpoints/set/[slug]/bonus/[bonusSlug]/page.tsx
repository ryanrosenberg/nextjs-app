import BonusDisplay from "../../../../../../components/BonusDisplay";
import Layout from "../../../../../../components/Layout";
import { Bonus, BonusDirect, BonusPart, BonusSummary, QuestionSet } from "../../../../../../types";
import { removeTags, shortenAnswerline } from "../../../../../../lib/utils";
import { sql, getDirectsByBonusQuery, getBonusesByQuestionSetQuery, getQuestionSetsQuery, getQuestionSetBySlugQuery, getBonusPartsBySlugQuery, getBonusSummaryBySite } from "../../../../../../lib/queries";
import { Metadata } from "next";

// export const runtime = 'edge'; 

export async function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: { params: { slug:string, bonusSlug:string }}): Promise<Metadata> {
    const [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]);
    const bonusParts = await sql(getBonusPartsBySlugQuery, [questionSet.id, params.bonusSlug]) as BonusPart[];
    
    return {
        title: `${removeTags(shortenAnswerline(bonusParts[0].answer))} - ${questionSet.name} - Buzzpoints App`,
        description: `Bonus data for ${questionSet!.name}`,
    };
}

export default async function BonusPage({ params }: { params: { slug:string, bonusSlug:string }}) {
    const [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]) as QuestionSet[];
    const parts = await sql(getBonusPartsBySlugQuery, [questionSet.id, params.bonusSlug]) as BonusPart[];
    const directs = await sql(getDirectsByBonusQuery, [parts[0].id, null]) as BonusDirect[];
    const bonusSummary = await sql(getBonusSummaryBySite, [parts[0].id, questionSet.id]) as BonusSummary[];

    return (
        <Layout questionSet={questionSet}>
            <BonusDisplay 
                parts={parts} 
                directs={directs} 
                questionSet={questionSet} 
                bonusSummary={bonusSummary}
            />
        </Layout>
    );
}