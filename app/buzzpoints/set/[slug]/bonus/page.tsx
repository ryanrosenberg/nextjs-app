import Layout from "../../../../../components/Layout";
import { sql, getBonusesByQuestionSetQuery, getQuestionSetBySlugQuery, getQuestionSetsQuery } from "../../../../../lib/queries";
import { Bonus, QuestionSet } from "../../../../../types";
import { Metadata } from "next";
import { TournamentBonusTable } from "../../../../../components/common/TournamentBonusTable";

export async function generateStaticParams() {
    const questionSets: QuestionSet[] = await sql(getQuestionSetsQuery) as QuestionSet[];

    return questionSets.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]);

    return {
        title: `${questionSet.name} Bonuses - Buzzpoints App`,
        description: `Bonus data for ${questionSet!.name}`,
    };
}
export default async function BonusesPage({ params }: { params: { slug: string } }) {
    const [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]) as QuestionSet[];
    const bonuses = await sql(getBonusesByQuestionSetQuery, [questionSet!.id]) as Bonus[];

    return (
        <Layout questionSet={questionSet}>
            <TournamentBonusTable bonuses={bonuses} />
        </Layout>
    );
}