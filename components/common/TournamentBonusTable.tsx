'use client';

import { Bonus } from "../../types";
import Table from "../Table";
import { formatDecimal, formatPercent, shortenAnswerline } from "../../lib/utils";
import Link from "next/link";
import NormalTable from "../normal_table";

type BonusTableProps = {
    bonuses: Bonus[]
}

export function TournamentBonusTable({ bonuses }: BonusTableProps) {
    const columns = [
        {
            accessor: "category",
            Header: "Category",
            border: "right",
        },
        {
            accessor: "editions",
            Header: "Editions",
        },
        {
            accessor: "heard",
            Header: "Heard",
            border: "right",
        },
        {
            accessor: "ppb",
            Header: "PPB",
            format: formatDecimal,
            border: "right",
        },
        {
            accessor: "easy_part",
            Header: "Easy",
            sortaccessor: "easy_part_sanitized",
            render: (item:Bonus) => (
                <>
                    <Link
                        href={`/buzzpoints/set/${item.set_slug}/bonus/${item.slug}`}
                        className="underline"
                    >
                        <span dangerouslySetInnerHTML={{ __html: item.easy_part }}></span>
                    </Link>
                    <span className="ms-1 text-xs font-light">{" "}{`(Part ${item.easy_part_number})`}</span>
                </>
            )
        },
        {
            accessor: "easy_conversion",
            Header: "%",
            format: formatPercent,
            border: "right",
        },
        {
            accessor: "medium_part",
            Header: "Medium",
            sortaccessor: "medium_part_sanitized",
            render: (item:Bonus) => (
                <>
                    <Link
                        href={`/buzzpoints/set/${item.set_slug}/bonus/${item.slug}`}
                        className="underline"
                    >
                        <span dangerouslySetInnerHTML={{ __html: item.medium_part }}></span>
                    </Link>
                    <span className="ms-1 text-xs font-light">{" "}{`(Part ${item.medium_part_number})`}</span>
                </>
            )
        },
        {
            accessor: "medium_conversion",
            Header: "%",
            format: formatPercent,
            border: "right",
        },
        {
            accessor: "hard_part",
            Header: "Hard",
            sortaccessor: "hard_part_sanitized",
            render: (item:Bonus) => (
                <>
                    <Link
                        href={`/buzzpoints/set/${item.set_slug}/bonus/${item.slug}`}
                        className="underline"
                    >
                        <span dangerouslySetInnerHTML={{ __html: item.hard_part }}></span>
                    </Link>
                    <span className="ms-1 text-xs font-light">{" "}{`(Part ${item.hard_part_number})`}</span>
                </>
            )
        },
        {
            accessor: "hard_conversion",
            Header: "%",
            format: formatPercent
        }
    ];

    return <NormalTable
        columns={columns}
        data={bonuses.map(t => ({
            ...t,
            easy_part: shortenAnswerline(t.easy_part),
            medium_part: shortenAnswerline(t.medium_part),
            hard_part: shortenAnswerline(t.hard_part),
        }))}
    />
}