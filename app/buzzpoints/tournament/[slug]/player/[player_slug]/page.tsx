import Layout from "../../../../../../components/Layout";
import {
  sql,
  getPlayerCategoryStatsQuery,
  getTournamentBySlugQuery,
  getPlayerBuzzesQuery,
} from "../../../../../../lib/queries";
import { Metadata } from "next";
import { TossupConversion, Tournament } from "../../../../../../types";
import PlayerCategoryTable from "../../../../../../components/PlayerCategoryTable";
import PlayerBuzzTable from "../../../../../../components/PlayerBuzzTable";

export async function generateStaticParams() {
  return [];
  // const tournaments = await sql(getTournamentsQuery) as Tournament[];
  // const paths = [];

  // for (let { id, slug } of tournaments) {
  //     const players = getPlayersByTournamentQuery.all(id) as Player[];
  //     for (const { slug: player_slug } of players) {
  //         paths.push({
  //             slug,
  //             player_slug
  //         });
  //     }
  // }

  // return paths;
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  let [tournament] = (await sql(getTournamentBySlugQuery, [
    params.slug,
  ])) as Tournament[];

  return {
    title: `${tournament.name} - Buzzpoints App`,
    description: `Player category data for ${tournament!.name}`,
  };
}

export default async function PlayerPage(
  props: {
    params: Promise<{ slug: string; player_slug: string }>;
  }
) {
  const params = await props.params;
  const [tournament] = (await sql(getTournamentBySlugQuery, [
    params.slug,
  ])) as Tournament[];
  const tossupPlayerCategoryStats = (await sql(getPlayerCategoryStatsQuery, [
    tournament.id,
    tournament.id,
    params.player_slug,
  ])) as TossupConversion[];
  const tossupPlayerBuzzes = await sql(getPlayerBuzzesQuery, [
    tournament.id,
    params.player_slug,
  ]);

  // console.log([tournament.id, params.player_slug]);
  // console.log(tossupPlayerBuzzes);

  return (
    <Layout tournament={tournament}>
      <h3 className="page-title">
        {tossupPlayerCategoryStats[0]?.name || "N/A"}
      </h3>
      <h3 className="page-subtitle">
        {tossupPlayerCategoryStats[0]?.team || "N/A"}
      </h3>
      <br />
      <h2>Categories</h2>
      <PlayerCategoryTable categories={tossupPlayerCategoryStats} />
      <br />
      <h2>Buzzes</h2>
      <PlayerBuzzTable buzzes={tossupPlayerBuzzes} />
    </Layout>
  );
}
