import Table from "../Table";
import { Buzz } from "../../types";
import styles from "./tossups.module.css";

type TossupBuzzesProps = {
  buzzes: Buzz[];
  buzzpoint: number | null;
  setBuzzpoint: (buzzpoint: number) => void;
};

export default function TossupBuzzes({
  buzzes,
  buzzpoint,
  setBuzzpoint,
}: TossupBuzzesProps) {
  const columns = [
    {
      key: "player_name",
      label: "Player",
    },
    {
      key: "team_name",
      label: "Team",
    },
    {
      key: "opponent_name",
      label: "Opponent",
    },
    {
      key: "buzz_position",
      label: "Buzz Position",
      defaultSort: "asc" as const,
    },
    {
      key: "value",
      label: "Value",
    },
  ];

  return (
    <div className={styles.tossupBuzzTable}>
      <Table
        columns={columns}
        data={buzzes}
        rowProperties={(item) => ({
          onClick: () => setBuzzpoint(item.buzz_position),
          style: {
            cursor: "pointer",
          },
          className: `${
            item.buzz_position === buzzpoint ? styles.highlightedRow : ""
          } ${
            item.value > 0
              ? styles.get
              : item.value < 0
              ? styles.neg
              : styles.zero
          }`,
        })}
      />
    </div>
  );
}
