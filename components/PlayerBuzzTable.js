'use client';

import PaginatedTable from './paginated_table'

export default function PlayerBuzzTable(buzzes) {
    console.log(buzzes);
    const columns = [
        {
            accessor: "category",
            Header: "Category",
            border: "right",
            linkTemplate: "/buzzpoints/tournament/{{tournament_slug}}/category-tossup/{{category_slug}}"
        },
        {
            accessor: "answer",
            Header: "Answer",
            border: "right",
            linkTemplate: "/buzzpoints/tournament/{{tournament_slug}}/tossup/{{round}}/{{question_number}}"
        },
        {
            accessor: "value",
            Header: "Value",
            border: "right",
        },
        {
            accessor: "buzz_position",
            Header: "Buzz Position",
        },
    ];

    return <PaginatedTable
        columns={columns}
        data={buzzes.buzzes}
        itemsPerPage={10}
    />
}
