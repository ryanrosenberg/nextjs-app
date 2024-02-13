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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let [tournament] = (await sql(getTournamentBySlugQuery, [
    params.slug,
  ])) as Tournament[];

  return {
    title: `${tournament.name} - Buzzpoints App`,
    description: `Player category data for ${tournament!.name}`,
  };
}

export default async function PlayerPage({
  params,
}: {
  params: { slug: string; player_slug: string };
}) {
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
      <PlayerCategoryTable categories={tossupPlayerCategoryStats} />
      <br />
      <br />
      <PlayerBuzzTable buzzes={tossupPlayerBuzzes} />
    </Layout>
  );
}
