import styles from "../components/scoresheet.module.css";
import _ from "lodash";

export default function BuzzpointScoresheet({ buzzes, bonuses = null, packet, players }) {
    const tournament_slug = buzzes[0].slug;
    const round_number = buzzes[0].round_number;

    const player_teams = _.partition(players, (player) => player.team === players[0].team);

    const team1_players = player_teams[0].map((player) => player.player);
    const team2_players = player_teams[1].map((player) => player.player);

    var tuh = packet.length;

    var team1_score = 0;
    var team2_score = 0;
    var bonus_number = 0;
    return (
        <div className={styles.scoresheet}>
            <div className={styles.teamDiv}>
                <table className={styles.playerNameTable}>
                    <thead className={styles.playerRow}>
                        <tr>
                            {team1_players.map((player, i) => {
                                return (
                                    <th className={styles.playerName} key={`team-one-player-${i}`}>{player}</th>
                                );
                            })}
                            {bonuses ? <th key="bonus-1-team-one" colSpan={3}>Bonuses</th> : ""
                            }
                            <th>Total</th>
                            <th>
                                <span>TU</span>
                            </th>
                            {team2_players.map((player, i) => {
                                return (
                                    <th className={styles.playerName} key={`team-two-player-${i}`}>{player}</th>
                                );
                            })}
                            {bonuses ? <th key="bonus-1-team-two" colSpan={3}>Bonuses</th> : ""
                            }
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.range(1, tuh + 1).map((i) => {
                            const tu_buzzes = buzzes.filter(buzz => buzz.question_number === String(i));
                            const team1_buzzes = team1_players.map(
                                (player) => (
                                    tu_buzzes.filter(item => item.player.toLowerCase() === player.toLowerCase()).length > 0 ?
                                        tu_buzzes.filter(item => item.player.toLowerCase() === player.toLowerCase()) :
                                        []))
                            const team2_buzzes = team2_players.map(
                                (player) => (
                                    tu_buzzes.filter(item => item.player.toLowerCase() === player.toLowerCase()).length > 0 ?
                                        tu_buzzes.filter(item => item.player.toLowerCase() === player.toLowerCase()) :
                                        []))

                            const team1_bonuses = team1_buzzes.filter(
                                item => item.length > 0
                            ).filter(
                                item => item[0].value > 0
                            ).length > 0 ?
                                bonuses.slice(bonus_number, bonus_number + 3).map((item, i) => <td key={`bonus-team-one-part-${i}`} className={i === 2 ? styles.lastBonus : styles.bonus}><a href={`/buzzpoints/tournament/${tournament_slug}/bonus/${item.round_number}/${item.question_number}`}>{item.value}</a></td>) :
                                [1, 2, 3].map((item, i) => <td key={`bonus-team-one-part-${i}`} className={i === 2 ? styles.lastBonus : styles.bonus}></td>)

                            const team2_bonuses = team2_buzzes.filter(
                                item => item.length > 0
                            ).filter(
                                item => item[0].value > 0
                            ).length > 0 ?
                                bonuses.slice(bonus_number, bonus_number + 3).map((item, i) => <td key={`bonus-team-two-part-${i}`} className={i === 2 ? styles.lastBonus : styles.bonus}><a href={`/buzzpoints/tournament/${tournament_slug}/bonus/${item.round_number}/${item.question_number}`}>{item.value}</a></td>) :
                                [1, 2, 3].map((item, i) => <td key={`bonus-team-two-part-${i}`} className={i === 2 ? styles.lastBonus : styles.bonus}></td>)

                            // console.log(team2_buzzes.filter(
                            //     item => item.length > 0
                            // ).filter(
                            //     item => item[0].value > 0
                            // ).length > 0 ?
                            //     bonuses.slice(bonus_number, bonus_number + 3) : "");
                            team1_score = team1_buzzes.filter(
                                item => item.length > 0
                            ).map(item => { const val = item[0].value; return Number(val) }).reduce(
                                (accumulator, currentValue) => accumulator + currentValue,
                                team1_score);

                            if (team1_buzzes.filter(
                                item => item.length > 0
                            ).filter(
                                item => item[0].value > 0
                            ).length > 0) {
                                team1_score = bonuses.slice(bonus_number, bonus_number + 3).map(item => Number(item.value)).reduce(
                                    (accumulator, currentValue) => accumulator + currentValue,
                                    team1_score);
                            }

                            team2_score = team2_buzzes.filter(
                                item => item.length > 0
                            ).map(item => { const val = item[0].value; return Number(val) }).reduce(
                                (accumulator, currentValue) => accumulator + currentValue,
                                team2_score);

                            if (team2_buzzes.filter(
                                item => item.length > 0
                            ).filter(
                                item => item[0].value > 0
                            ).length > 0) {
                                team2_score = bonuses.slice(bonus_number, bonus_number + 3).map(item => Number(item.value)).reduce(
                                    (accumulator, currentValue) => accumulator + currentValue,
                                    team2_score);
                            }


                            if (team1_buzzes.filter(
                                item => item.length > 0
                            ).filter(
                                item => item[0].value > 0
                            ).length > 0 | team2_buzzes.filter(
                                item => item.length > 0
                            ).filter(
                                item => item[0].value > 0
                            ).length > 0) {
                                bonus_number += 3;
                            }

                            return (
                                <tr key={i} className={i % 5 == 0 ? styles.dividerRow : ""}>
                                    {team1_buzzes.map((item, num) => (
                                        item.length > 0 ?
                                            <td className={num == team1_players.length - 1 ? styles.lastPlayer : styles.player} key={`team-one-player-${num}`}>
                                                <span className={item[0].value < 0 ?
                                                    styles.buzzNeg : item[0].value > 10 ? styles.buzzPower : item[0].value > 0 ? styles.buzzGet : styles.buzzZero}>{item[0].value}</span> <a href={`/buzzpoints/tournament/${tournament_slug}/tossup/${round_number}/${i}`} className={styles.buzzPosition}>{item[0].buzz_position}</a></td> :
                                            <td className={num == team1_players.length - 1 ? styles.lastPlayer : styles.player} key={`team-one-player-${num}`}></td>
                                    )).concat(
                                        team1_bonuses
                                    ).concat(
                                        <td key='team-one-total' className={`${styles.teamTotal} ${team1_score > team2_score ? styles.winningTeamTotal : ""}`}>{team1_score}</td>
                                    ).concat(
                                        <td className={styles.tuNumberCell} key='tu'><span className={styles.tuNumber}>{i}</span></td>
                                    ).concat(team2_buzzes.map((item, num) => (
                                        item.length > 0 ?
                                            <td className={num == team2_players.length - 1 ? styles.lastPlayer : styles.player} key={`team-two-player-${num}`}>
                                                <span className={item[0].value < 0 ? styles.buzzNeg : item[0].value > 10 ? styles.buzzPower : item[0].value > 0 ? styles.buzzGet : styles.buzzZero}>{item[0].value}</span> <a href={`/buzzpoints/tournament/${tournament_slug}/tossup/${round_number}/${i}`} className={styles.buzzPosition}>{item[0].buzz_position}</a></td> :
                                            <td className={num == team2_players.length - 1 ? styles.lastPlayer : styles.player} key={`team-two-player-${num}`}></td>
                                    ))).concat(
                                        team2_bonuses
                                    ).concat(
                                        <td key='team-two-total' className={`${styles.teamTotal} ${team2_score > team1_score ? styles.winningTeamTotal : ""}`}>{team2_score}</td>
                                    )}
                                </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            {/* <div>
                <h3>Key</h3>
                <table className={styles.demoTotal}>
                    <tr>
                        <td className={`${styles.teamTotal} ${styles.winningTeamTotal}`}>20</td>
                    </tr>
                </table>
                <div><div style={{ display: "inline-block", backgroundColor: "wheat", width: "25px", height: "25px", verticalAlign: "middle" }}></div>{"  "}= winning team</div>
                <br />
                <table>
                    <tr>
                        <td className={styles.player} style={{border: "1px solid black", textAlign: "center"}}>
                            <span className={styles.buzzGet}>10</span>
                            {" "}
                            <a href={`/buzzpoints/tournament/${tournament_slug}/tossup/1/1`} className={styles.buzzPosition}>109</a>
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.player}>
                            <span className={styles.buzzGet}>10</span>
                            {" "}
                            = buzz value
                        </td>
                    </tr>
                    <tr>
                        <td className={styles.player}>
                        <a href={`/buzzpoints/tournament/${tournament_slug}/tossup/1/1`} className={styles.buzzPosition}>109</a>
                            {" "}
                            = # of words into question buzz occurred<br/>(link goes to question text)
                        </td>
                    </tr>
                </table>
            </div> */}
        </div>
    )
}