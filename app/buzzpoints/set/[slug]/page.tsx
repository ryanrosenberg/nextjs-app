import Link from "next/link";
import TossupCategoryTable from "../../../../components/TossupCategoryTable";
import Layout from "../../../../components/Layout";
import {
  sql,
  getBonusCategoryStatsForSetQuery,
  getQuestionSetBySlugQuery,
  getQuestionSetsQuery,
  getTossupCategoryStatsForSetQuery,
} from "../../../../lib/queries";
import { Metadata } from "next";
import { BonusCategory, type QuestionSet, TossupCategory } from "../../../../types";
import BonusCategoryTable from "../../../../components/BonusCategoryTable";
import QuestionSetSummary from "../../../../components/QuestionSetSummary";
import styles from "../../buzzpoints.module.css";

export async function generateStaticParams() {
  const questionSets: QuestionSet[] = (await sql(
    getQuestionSetsQuery
  )) as QuestionSet[];

  return questionSets.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const [qSet] = await sql(getQuestionSetBySlugQuery, [params.slug]);

  return {
    title: `${qSet.name} - Buzzpoints App`,
    description: `Category conversion data for question set ${
      qSet!.name
    }`,
  };
}

export default async function QuestionSet(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const [qSet] = (await sql(getQuestionSetBySlugQuery, [
    params.slug,
  ])) as QuestionSet[];
  const tossupCategoryStats = (await sql(getTossupCategoryStatsForSetQuery, [
    qSet.id,
  ])) as TossupCategory[];
  const bonusCategoryStats = (await sql(getBonusCategoryStatsForSetQuery, [
    qSet.id,
  ])) as BonusCategory[];

  return (
    <Layout questionSet={qSet}>
      <QuestionSetSummary questionSets={[qSet]} detailPage={true} />
      <div className={styles.tournamentFlex}>
        <div className="md:basis-1/2">
          <h2>Tossups</h2>
          <p className="mb-2">
            <Link
              href={`/buzzpoints/set/${qSet.slug}/tossup`}
              className="underline"
            >
              View all tossups
            </Link>
          </p>
          <TossupCategoryTable
            tossupCategoryStats={tossupCategoryStats}
            categoryLinks={false}
          />
        </div>
        <div className="md:basis-1/2">
          <h2>Bonuses</h2>
          <p className="mb-2">
            <Link
              href={`/buzzpoints/set/${qSet.slug}/bonus`}
              className="underline"
            >
              View all bonuses
            </Link>
          </p>
          <BonusCategoryTable
            bonusCategoryStats={bonusCategoryStats}
            categoryLinks={false}
          />
        </div>
      </div>
    </Layout>
  );
}
