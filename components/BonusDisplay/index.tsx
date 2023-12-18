import Link from "next/link";
import BonusData from "./BonusData";
import BonusText from "./BonusText";
import { BonusDirect, BonusPart, Tournament } from "../../types";
import styles from "../TossupDisplay/tossups.module.css";

type BonusDisplayProps = {
  parts: BonusPart[];
  directs: BonusDirect[];
  tournament: Tournament;
  navOptions: any;
};

export default function BonusDisplay({
  parts,
  directs,
  tournament,
  navOptions,
}: BonusDisplayProps) {
  return (
    <div className={styles.tossupDisplayFlex}>
      <div style={{'flex': 2}}>
        <h3 className="text-xl font-bold my-3">Question</h3>
        <div className="mb-2">
          {!!navOptions.previous && (
            <Link
              href={`/buzzpoints/${tournament.slug}/bonus/${navOptions.previous.round}/${navOptions.previous.number}`}
              className="underline"
            >
              Previous bonus
            </Link>
          )}
          {!!navOptions.previous && !!navOptions.next && " - "}
          {!!navOptions.next && (
            <Link
              href={`/buzzpoints/${tournament.slug}/bonus/${navOptions.next.round}/${navOptions.next.number}`}
              className="underline"
            >
              Next bonus
            </Link>
          )}
        </div>
        <div className={styles.tossupText}>
          <BonusText parts={parts} />
          {!!parts[0]?.metadata && <div>{"<" + parts[0]?.metadata + ">"}</div>}
        </div>
        <p className="mt-2">
          <Link
            href={`/buzzpoints/${tournament.slug}/bonus`}
            className="underline"
          >
            Back to bonuses
          </Link>
        </p>
      </div>
      <div style={{'flex': 1}}>
        <h3 className="text-xl font-bold my-3">Data</h3>
        <br/>
        <BonusData directs={directs} />
      </div>
    </div>
  );
}
