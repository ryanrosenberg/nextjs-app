import Layout from "../../../../../components/Layout";
import { TournamentTossupTable } from "../../../../../components/common/TournamentTossupTable";
import { QuestionSet, Tossup } from "../../../../../types";
import { sql, getQuestionSetBySlugQuery, getQuestionSetsQuery, getTossupsByQuestionSetQuery } from "../../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const questionSets: QuestionSet[] = await sql(getQuestionSetsQuery) as QuestionSet[];

    return questionSets.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    let [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]);
    
    return {
        title: `${questionSet.name} Tossups - Buzzpoints App`,
        description: `Tossup data for ${questionSet!.name}`,
    };
}

export default async function TossupPage({ params }: { params: { slug: string } }) {
    const [questionSet] = await sql(getQuestionSetBySlugQuery, [params.slug]) as QuestionSet[];
    const tossups = await sql(getTossupsByQuestionSetQuery, [questionSet!.id]) as Tossup[];

    return (
        <Layout questionSet={questionSet}>
            <TournamentTossupTable tossups={tossups} />
        </Layout>
    );
}