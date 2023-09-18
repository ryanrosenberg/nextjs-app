"use client";

import { Tossup, Word } from "../../types";
import {
  formatDecimal,
  formatPercent,
  removeTags,
  shortenAnswerline,
} from "../../lib/jordan_utils";
import NormalTable from "../normal_table";
import styles from "../TossupDisplay/tossups.module.css";

type TossupTableProps = {
  tossups: Tossup[];
};

export function TossupTable({ tossups }: TossupTableProps) {
  const columns = [
    {
      accessor: "round",
      Header: "Round",
    },
    {
      accessor: "question_number",
      Header: "#",
    },
    {
      accessor: "category",
      Header: "Category",
    },
    {
      accessor: "answer",
      Header: "Answer",
      linkTemplate:
        "/buzzpoints/{{tournament_slug}}/tossup/{{round}}/{{question_number}}",
      html: true,
    },
    {
      accessor: "heard",
      Header: "Heard",
    },
    {
      accessor: "conversion_rate",
      Header: "Conv. %",
      format: formatPercent,
    },
    {
      accessor: "power_rate",
      Header: "Power %",
      format: formatPercent,
    },
    {
      accessor: "first_buzz",
      Header: "First Buzz",
    },
    {
      accessor: "average_buzz",
      Header: "Average Buzz",
      format: formatDecimal,
    },
  ];

  return (
    <div className='test'>
      <NormalTable
        columns={columns}
        data={tossups.map((t) => ({
          ...t,
          answer: shortenAnswerline(t.answer),
        }))}
      />
    </div>
  );
}
