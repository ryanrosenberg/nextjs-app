'use client'

import NestedSideNav from "../../components/nested_side_nav";
import NormalTable from "../../components/normal_table";
import PaginatedTable from "../../components/paginated_table";
import styles from "./records.module.css";
import { slugify } from "../../lib/utils";

export default function Records({ result }) {
  const data = result.props.result;
  console.log(data);
  const circuits = [
    "Asia",
    "Central CC",
    "Eastern Canada",
    "Florida CC",
    "Great Lakes",
    "Great West",
    "Lower Mid-Atlantic",
    "Midwest",
    "New York",
    "North",
    "Northeast",
    "Northern California",
    "Pacific Northwest",
    "Plains CC",
    "Southeast",
    "Southeast CC",
    "Southern California",
    "UK",
    "Upper Mid-Atlantic",
  ];

  circuits.sort();

  return (
    <>
      <div
        className="main-container"
        data-bs-spy="scroll"
        data-bs-target="#navbar-example"
      >
        <div className="side-nav">
          <NestedSideNav />
        </div>
        <div className="main-content">
          <i className={styles.note}>
            Note: novice and open tournaments are excluded from the competition
            (i.e. non-hosting) records.
          </i>
          <h2 id="circuit-records">Circuit Records</h2>
          <div className={styles.circuitFlex}>
            <p>
              {circuits.map((circuit) => {
                return (
                  <a
                    className="circuit-link"
                    href={"../circuits/" + slugify(circuit) + "#records"}
                  >
                    {circuit}
                  </a>
                );
              })}
            </p>
          </div>
          <h2 id="school-records">School Records</h2>
          <h3 id="school-records-all-time-records">All-Time Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Wins</p>
              <NormalTable
                columns={[
                  {
                    Header: "School",
                    accessor: "School",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Tournaments",
                    accessor: "Tournaments",
                    border: "right",
                  },
                  {
                    Header: "Wins",
                    accessor: "Wins",
                  },
                ]}
                data={data[0]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest Winning Percentage</p>
              <NormalTable
                columns={[
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Tournaments",
                    accessor: "Tournaments",
                    border: "right",
                  },
                  {
                    Header: "Win%",
                    accessor: "Win%",
                  },
                ]}
                data={data[1]}
                footer={"min. 10 tournaments"}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Most Tournaments Won</p>
              <NormalTable
                columns={[
                  {
                    Header: "School",
                    accessor: "School",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Tournaments",
                    accessor: "Tournaments",
                    border: "right",
                  },
                  {
                    Header: "Wins",
                    accessor: "Wins",
                  },
                ]}
                data={data[2]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>
                Most ACF Nationals and DI ICT Titles
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "School",
                    accessor: "school",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Nats",
                    accessor: "ACF Nationals",
                  },
                  {
                    Header: "ICT",
                    accessor: "DI ICT",
                  },
                  {
                    Header: "Total",
                    accessor: "Total",
                  },
                ]}
                data={data[3]}
              />
            </div>
          </div>
          <h3 id="school-records-season-records">Season Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Wins in a Season</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Tournaments",
                    accessor: "Tournaments",
                  },
                  {
                    Header: "Wins",
                    accessor: "Wins",
                  },
                ]}
                data={data[4]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>
                Most Tournaments Won in a Season
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Tournaments",
                    accessor: "Tournaments",
                  },
                  {
                    Header: "Wins",
                    accessor: "Wins",
                  },
                ]}
                data={data[5]}
              />
            </div>
          </div>
          <h3 id="school-records-national-tournament-records">
            National Tournament Records
          </h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Highest PP20TUH</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "PP20TUH",
                    accessor: "PP20TUH",
                  },
                ]}
                data={data[6]}
                footer={"PP20TUH = points per 20 tossups heard"}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest TU%</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TU%",
                    accessor: "TU%",
                  },
                ]}
                data={data[7]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest PPB (normalized)</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "PPB",
                    accessor: "PPB",
                  },
                  {
                    Header: "mean",
                    accessor: "mean",
                  },
                  {
                    Header: "stdev",
                    accessor: "sd",
                  },
                  {
                    Header: "z-score",
                    accessor: "z",
                  },
                ]}
                data={data[8]}
              />
            </div>
          </div>
          <h3 id="school-records-tournament-records">Tournament Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Highest PP20TUH</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "PP20TUH",
                    accessor: "PP20TUH",
                  },
                ]}
                data={data[9]}
                footer={"PP20TUH = points per 20 tossups heard"}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest TU%</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TU%",
                    accessor: "TU%",
                  },
                ]}
                data={data[10]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest PPB (normalized)</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "PPB",
                    accessor: "PPB",
                  },
                  {
                    Header: "mean",
                    accessor: "mean",
                  },
                  {
                    Header: "stdev",
                    accessor: "sd",
                  },
                  {
                    Header: "z-score",
                    accessor: "z",
                  },
                ]}
                data={data[11]}
              />
            </div>
          </div>
          <h3 id="school-records-game-records">Game Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>
                Most Points in a Game, Winning Team
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                    align: "left",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[12]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>
                Most PP20TUH in a Full Game, Winning Team
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                    align: "left",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                    border: "right",
                  },
                  {
                    Header: "PP20TUH",
                    accessor: "PP20TUH",
                  },
                ]}
                data={data[13]}
                footer={"PP20TUH = points per 20 tossups heard"}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>
                Most Points in a Game, Both Teams
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                    align: "left",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Teams",
                    accessor: "Teams",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "Score",
                    accessor: "Score",
                    border: "right",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[14]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>
                Most PP20TUH in a Game, Both Teams
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                    align: "left",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Teams",
                    accessor: "Teams",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "Score",
                    accessor: "Score",
                    border: "right",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                  {
                    Header: "PP20TUH",
                    accessor: "PP20TUH",
                  },
                ]}
                data={data[15]}
                footer={"PP20TUH = points per 20 tossups heard"}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Negs in a Game</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                    align: "left",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Result",
                    accessor: "Result",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "15",
                    accessor: "15",
                  },
                  {
                    Header: "10",
                    accessor: "10",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                    border: "right",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[16]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest PPB in a Game</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                    align: "left",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Result",
                    accessor: "Result",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "15",
                    accessor: "15",
                  },
                  {
                    Header: "10",
                    accessor: "10",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                    border: "right",
                  },
                  {
                    Header: "BHrd",
                    accessor: "BHrd",
                  },
                  {
                    Header: "BPts",
                    accessor: "BPts",
                    border: "right",
                  },
                  {
                    Header: "PPB",
                    accessor: "PPB",
                  },
                ]}
                data={data[17]}
                footer={"Min. 8 bonuses heard"}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Grails</p>
              <PaginatedTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                    align: "left",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Opponent",
                    accessor: "Opponent",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "15",
                    accessor: "15",
                  },
                  {
                    Header: "10",
                    accessor: "10",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                    border: "right",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[18]}
                itemsPerPage={10}
              />
            </div>
          </div>
          <h2 id="player-records">Player Records</h2>
          <h3 id="player-records-all-time-records">All-Time Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Points Scored</p>
              <NormalTable
                columns={[
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Ts",
                    accessor: "Ts",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                    border: "right",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[19]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Most Tournaments Played</p>
              <NormalTable
                columns={[
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Schools",
                    accessor: "Schools",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Ts",
                    accessor: "Ts",
                  },
                ]}
                data={data[20]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>
                Most National Tournaments Played
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Schools",
                    accessor: "Schools",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Ts",
                    accessor: "Ts",
                  },
                ]}
                data={data[21]}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Wins</p>
              <NormalTable
                columns={[
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Schools",
                    accessor: "Schools",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Wins",
                    accessor: "Wins",
                  },
                ]}
                data={data[22]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Most Tournament Wins</p>
              <NormalTable
                columns={[
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Schools",
                    accessor: "Schools",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Wins",
                    accessor: "Wins",
                  },
                ]}
                data={data[23]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest Winning Percentage</p>
              <NormalTable
                columns={[
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Schools",
                    accessor: "Schools",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                    border: "right",
                  },
                  {
                    Header: "Win%",
                    accessor: "Win%",
                  },
                ]}
                data={data[24]}
                footer={"Min. 50 games played"}
              />
            </div>
          </div>
          <h3 id="player-records-season-records">Season Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Points in a Season</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "School",
                    accessor: "School",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Ts",
                    accessor: "Ts",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[25]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Highest PP20TUH in a Season</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "School",
                    accessor: "School",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Ts",
                    accessor: "Ts",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                    border: "right",
                  },
                  {
                    Header: "PP20TUH",
                    accessor: "PP20TUH",
                  },
                ]}
                data={data[26]}
                footer={"PP20TUH = points per 20 tossups heard, min. 3 tournaments played"}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>
                Highest Winning Percentage in a Season
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "School",
                    accessor: "School",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Ts",
                    accessor: "Ts",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                    border: "right",
                  },
                  {
                    Header: "Win%",
                    accessor: "Win%",
                  },
                ]}
                data={data[27]}
                footer={"min. 3 tournaments played"}
              />
            </div>
          </div>
          <h3 id="player-records-tournament-records">Tournament Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>
                Highest PP20TUH in a Tournament
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                    border: "right",
                  },
                  {
                    Header: "PP20TUH",
                    accessor: "PP20TUH",
                  },
                ]}
                data={data[28]}
                footer={"PP20TUH = points per 20 tossups heard"}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>
                Highest PP20TUH in a National Tournament
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                    border: "right",
                  },
                  {
                    Header: "PP20TUH",
                    accessor: "PP20TUH",
                  },
                ]}
                data={data[29]}
                footer={"PP20TUH = points per 20 tossups heard"}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>
                Most Negs per 20 TUH in a Tournament
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "GP",
                    accessor: "GP",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                    border: "right",
                  },
                  {
                    Header: "-5P20TUH",
                    accessor: "-5P20TUH",
                  },
                ]}
                data={data[30]}
                footer={"Min. 5 games played"}
              />
            </div>
          </div>
          <h3 id="player-records-game-records">Game Records</h3>
          <hr className={styles.hr} />
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Points in a Game</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "15",
                    accessor: "15",
                  },
                  {
                    Header: "10",
                    accessor: "10",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[31]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>
                Most Points in a National Tournament Game
              </p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "15",
                    accessor: "15",
                  },
                  {
                    Header: "10",
                    accessor: "10",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                  },
                  {
                    Header: "Pts",
                    accessor: "Pts",
                  },
                ]}
                data={data[32]}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Tossups in a Game</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "15",
                    accessor: "15",
                  },
                  {
                    Header: "10",
                    accessor: "10",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                    border: "right",
                  },
                  {
                    Header: "Tossups",
                    accessor: "Tossups",
                  },
                ]}
                data={data[33]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Most Negs in a Game</p>
              <NormalTable
                columns={[
                  {
                    Header: "Season",
                    accessor: "Season",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Team",
                    accessor: "Team",
                    align: "left",
                  },
                  {
                    Header: "Player",
                    accessor: "Player",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "TUH",
                    accessor: "TUH",
                    border: "right",
                  },
                  {
                    Header: "15",
                    accessor: "15",
                  },
                  {
                    Header: "10",
                    accessor: "10",
                  },
                  {
                    Header: "-5",
                    accessor: "-5",
                  },
                ]}
                data={data[34]}
              />
            </div>
          </div>
          <h2 id="hosting-records">Hosting Records</h2>
          <div className={styles.row}>
            <div>
              <p className={styles.tableHeader}>Most Tournaments Hosted</p>
              <NormalTable
                columns={[
                  {
                    Header: "School",
                    accessor: "School",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Tournaments",
                    accessor: "Tournaments",
                  },
                ]}
                data={data[35]}
              />
            </div>
            <div>
              <p className={styles.tableHeader}>Largest Tournaments Hosted</p>
              <NormalTable
                columns={[
                  {
                    Header: "Year",
                    accessor: "Year",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Tournament",
                    accessor: "Tournament",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Host",
                    accessor: "Host",
                    align: "left",
                    border: "right",
                  },
                  {
                    Header: "Teams",
                    accessor: "Teams",
                  },
                ]}
                data={data[36]}
                footer={"In-person, non-national tournaments only"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
