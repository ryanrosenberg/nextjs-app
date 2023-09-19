import { Buzz, Tossup } from "../../types";
import Table from "../Table";
import { formatDecimal, formatPercent } from "../../lib/jordan_utils";
import NormalTable from "../normal_table";

type TossupSummaryProps = {
    buzzes: Buzz[];
    tossup: Tossup;
}

export default function TossupSummary({ buzzes, tossup: { heard, average_buzz } }: TossupSummaryProps) {
    let columns = [
        { accessor: 'conversion_rate', Header: 'Conv. %', format: formatPercent },
        { accessor: 'power_rate', Header: 'Power %', format: formatPercent },
        { accessor: 'average_buzz', Header: 'Avg. Buzz', format: formatDecimal }
    ];
    let correctBuzzes = buzzes.filter(b => b.value > 0).map(b => b.buzz_position);
    let items = [{
        conversion_rate: correctBuzzes.length / heard,
        power_rate: buzzes.filter(b => b.value > 10).length / heard,
        average_buzz
    }];

    return <div className="my-3">
        <NormalTable columns={columns} data={items} />
    </div>;
}