"use client";

import TossupText from "./TossupText";
import TossupBuzzes from "./TossupBuzzes";
import { useState } from "react";
import Link from "next/link";
import TossupSummaryDisplay from "./TossupSummary";
import {
  Buzz,
  BuzzDictionary,
  QuestionSet,
  Tossup,
  TossupSummary,
  Tournament,
} from "../../types";
import TossupGraph from "./TossupGraph";
import styles from "./tossups.module.css";

type TossupProps = {
  tossup: Tossup;
  buzzes: Buzz[];
  tournament?: Tournament;
  questionSet?: QuestionSet;
  navOptions?: any;
  tossupSummary: TossupSummary[];
};

export default function TossupDisplay({
  tossup,
  buzzes,
  tournament,
  questionSet,
  navOptions,
  tossupSummary,
}: TossupProps) {
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [buzzpoint, setBuzzpoint] = useState<number | null>(null);
  const buzzDictionary: BuzzDictionary = buzzes.reduce(
    (a, b) => ({
      ...a,
      [b.buzz_position]: [...(a[b.buzz_position] || []), b.value],
    }),
    {} as BuzzDictionary
  );

  return (
    <div className={styles.tossupDisplayFlex}>
      <div className={styles.tossupInfoFlex}>
        <h3 className="text-xl font-bold my-3">Question</h3>
        {!!navOptions && !!tournament && (
          <div className="mb-2">
            {!!navOptions.previous && (
              <Link
                href={`/buzzpoints/tournament/${tournament.slug}/tossup/${navOptions.previous.round}/${navOptions.previous.number}`}
                className="underline"
              >
                Previous tossup
              </Link>
            )}
            {!!navOptions.previous && !!navOptions.next && " - "}
            {!!navOptions.next && (
              <Link
                href={`/buzzpoints/tournament/${tournament.slug}/tossup/${navOptions.next.round}/${navOptions.next.number}`}
                className="underline"
              >
                Next tossup
              </Link>
            )}
          </div>
        )}
        <div className={styles.tossupText}>
          <TossupText
            tossup={tossup}
            buzzes={buzzDictionary}
            hoverPosition={hoverPosition}
            averageBuzz={tossup.average_buzz}
            buzzpoint={buzzpoint}
            onBuzzpointChange={(buzzpoint: number) => setBuzzpoint(buzzpoint)}
          />
        </div>
        <TossupGraph
          buzzes={buzzDictionary}
          onHoverPositionChange={(position) => setHoverPosition(position)}
        />
        {(!!tournament || !!questionSet) && (
          <p className="mb-2">
            <Link
              href={
                tournament
                  ? `/buzzpoints/tournament/${tournament.slug}/tossup`
                  : `/buzzpoints/set/${questionSet!.slug}/tossup`
              }
              className="underline"
            >
              Back to tossups
            </Link>
          </p>
        )}
        {buzzes.length > 10 ?<div>
          <h3 className="text-xl font-bold my-3">Summary</h3>
          <TossupSummaryDisplay
            tossupSummary={tossupSummary}
            tournament={tournament}
          />
        </div> : ""}
      </div>
      <div className={styles.tossupBuzzesFlex}>
        <h3 className="text-xl font-bold my-3">Buzzes</h3>
        <TossupBuzzes
          buzzes={buzzes}
          buzzpoint={buzzpoint}
          setBuzzpoint={setBuzzpoint}
        />
        {buzzes.length <= 10 ?<div>
          <br/>
          <h3 className="text-xl font-bold my-3">Summary</h3>
          <TossupSummaryDisplay
            tossupSummary={tossupSummary}
            tournament={tournament}
          />
        </div> : ""}
      </div>
    </div>
  );
}
