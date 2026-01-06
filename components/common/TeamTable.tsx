'use client';

import Table from "../Table";
import { formatDecimal } from "../../lib/utils";
import NormalTable from "../normal_table";

type TeamTableProps = {
    teams: any[]
}

export function TeamTable({ teams }: TeamTableProps) {
    const columns = [
        {
            accessor: "name",
            Header: "Team",
            linkTemplate: "/buzzpoints/tournament/{{tournament_slug}}/team/{{slug}}",
            html: true,
            border: "right"
        },
        {
            accessor: "powers",
            Header: "Powers",
            defaultDescending: true
        },
        {
            accessor: "gets",
            Header: "Gets",
            defaultDescending: true
        },
        {
            accessor: "negs",
            Header: "Negs",
            defaultDescending: true,
            border: "right"
        },
        {
            accessor: "bouncebacks",
            Header: "Bouncebacks",
            defaultDescending: true,
            border: "right"
        },
        {
            accessor: "points",
            Header: "Points",
            defaultDescending: true,
            border: "right"
        },
        {
            accessor: "earliest_buzz",
            Header: "Earliest Buzz"
        },
        {
            accessor: "average_buzz",
            Header: "Avg. Buzz",
            format: formatDecimal,
            border: "right"
        },
        {
            accessor: "first_buzzes",
            Header: "First Buzzes",
            defaultDescending: true
        },
        {
            accessor: "top_three_buzzes",
            Header: "Top 3 Buzzes",
            border: "right",
            defaultDescending: true
        },
        {
            accessor: "bpa",
            Header: "BPA",
            format: formatDecimal,
            Tooltip: "Buzz Point AUC, the % of words in a question that the team prevented from being read by getting the tossup"
        },
        {
            accessor: "pvf",
            Header: "PVF",
            format: formatDecimal,
            Tooltip: "Percent Versus Field, the % of rooms the team would have beaten to these tossups"
        }
    ];

    return <NormalTable
        columns={columns}
        data={teams}
    />
}
