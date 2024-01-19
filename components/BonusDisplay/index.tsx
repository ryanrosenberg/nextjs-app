import Link from "next/link";
import BonusData from "./BonusData";
import BonusText from "./BonusText";
import BonusSummaryDisplay from "./BonusSummary";
import {
  BonusDirect,
  BonusPart,
  Tournament,
  BonusSummary,
  QuestionSet,
} from "../../types";
import styles from "../TossupDisplay/tossups.module.css";

type BonusDisplayProps = {
  parts: BonusPart[];
  directs: BonusDirect[];
  tournament?: Tournament;
  questionSet?: QuestionSet;
  navOptions?: any;
  bonusSummary: BonusSummary[];
};

export default function BonusDisplay({
  parts,
  directs,
  tournament,
  navOptions,
  questionSet,
  bonusSummary,
}: BonusDisplayProps) {
  return (
    <div>
      <div className={styles.bonusDisplayFlex}>
        <div className="md:basis-1/2" style={{flex: 2}}>
          <h3 className="text-xl font-bold my-3">Question</h3>
          {!!navOptions && !!tournament && (
            <div className="mb-2">
              {!!navOptions.previous && (
                <Link
                  href={`/buzzpoints/tournament/${tournament.slug}/bonus/${navOptions.previous.round}/${navOptions.previous.number}`}
                  className="underline"
                >
                  Previous bonus
                </Link>
              )}
              {!!navOptions.previous && !!navOptions.next && " - "}
              {!!navOptions.next && (
                <Link
                  href={`/buzzpoints/tournament/${tournament.slug}/bonus/${navOptions.next.round}/${navOptions.next.number}`}
                  className="underline"
                >
                  Next bonus
                </Link>
              )}
            </div>
          )}
          <div className={styles.tossupText}>
            <BonusText parts={parts} />
            {!!parts[0]?.metadata && (
              <div>{"<" + parts[0]?.metadata + ">"}</div>
            )}
          </div>
          {(!!tournament || !!questionSet) && (
            <p className="mt-2">
              <Link
                href={
                  tournament
                    ? `/buzzpoints/tournament/${tournament.slug}/bonus`
                    : `/buzzpoints/set/${questionSet!.slug}/bonus`
                }
                className="underline"
              >
                Back to bonuses
              </Link>
            </p>
          )}
          <h3 className="text-xl font-bold my-3">Summary</h3>
          <div>
            <BonusSummaryDisplay
              bonusSummary={bonusSummary}
              tournament={tournament}
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 className="text-xl font-bold my-3">Data</h3>
          <BonusData directs={directs} />
        </div>
      </div>
    </div>
  );
}
