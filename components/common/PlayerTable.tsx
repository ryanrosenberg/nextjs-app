'use client';

import { formatDecimal } from "../../lib/jordan_utils";
import NormalTable from "../normal_table";

type PlayerTableProps = {
    players: any[]
}

export function PlayerTable({ players }: PlayerTableProps) {
    const columns = [
        {
            accessor: "name",
            Header: "Player",
            linkTemplate:
              "/players/{{player_slug}}",
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
            defaultDescending: true
        },
        {
            accessor: "bouncebacks",
            Header: "Bouncebacks",
            defaultDescending: true
        },
        {
            accessor: "points",
            Header: "Points",
            defaultDescending: true
        },
        {
            accessor: "earliest_buzz",
            Header: "Earliest Buzz"
        },
        {
            accessor: "average_buzz",
            Header: "Avg. Buzz",
            format: formatDecimal
        },
        {
            accessor: "first_buzzes",
            Header: "First Buzzes",
            defaultDescending: true
        },
        {
            accessor: "top_three_buzzes",
            Header: "Top 3 Buzzes",
            defaultDescending: true
        }
    ];

    return <NormalTable
        columns={columns}
        data={players}
    />
}