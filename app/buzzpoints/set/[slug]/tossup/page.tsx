import Layout from "../../../../../components/Layout";
import { TournamentTossupTable } from "../../../../../components/common/TournamentTossupTable";
import { QuestionSet, Tossup } from "../../../../../types";
import { sql, getQuestionSetBySlugQuery, getQuestionSetsQuery, getTossupsByQuestionSetQuery } from "../../../../../lib/queries";
import { Metadata } from "next";

export async function generateStaticParams() {
    const questionSets: QuestionSet[] = await sql.query(getQuestionSetsQuery) as QuestionSet[];

    return questionSets.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    let [questionSet] = await sql.query(getQuestionSetBySlugQuery, [params.slug]);

    return {
        title: `${questionSet.name} Tossups - Buzzpoints App`,
        description: `Tossup data for ${questionSet!.name}`,
    };
}

export default async function TossupPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const [questionSet] = await sql.query(getQuestionSetBySlugQuery, [params.slug]) as QuestionSet[];
    const tossups = await sql.query(getTossupsByQuestionSetQuery, [questionSet!.id]) as Tossup[];

    return (
        <Layout questionSet={questionSet}>
            <TournamentTossupTable tossups={tossups} />
        </Layout>
    );
}