import { BonusDirect } from "../../types";
import Table from "../Table";
import NormalTable from "../normal_table";

type BonusDataProps = {
    directs: BonusDirect[]
}

export default function BonusData({ directs }: BonusDataProps) {
    const columns = [
        {
            accessor: "team_name",
            Header: "Team"
        },
        {
            accessor: "opponent_name",
            Header: "Opponent"
        },
        {
            accessor: "part_one",
            Header: "Part 1"
        }, 
        {
            accessor: "part_two",
            Header: "Part 2"
        }, 
        {
            accessor: "part_three",
            Header: "Part 3"
        },
        {
            accessor: "total",
            Header: "Total",
        }
    ];

    return (
        <NormalTable 
            columns={columns} 
            data={directs} 
        />
    );
}