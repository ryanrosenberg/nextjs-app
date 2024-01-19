import Link from "next/link";
import * as ra from "radash";

export const renderCell = (item, column) => {
  let cellValue = item[column.accessor];

  if (column.format) {
    if (column.digits) {
      cellValue = column.format(cellValue, column.digits)
    } else {
      cellValue = column.format(cellValue)
    }
  };

  if (column.html)
    cellValue = <span dangerouslySetInnerHTML={{ __html: cellValue }}></span>;

  if (column.linkTemplate)
    return (
      <Link href={ra.template(column.linkTemplate, item)} prefetch={false}>{cellValue}</Link>
    );

  return cellValue;
};

export const slugify = (text) => text.replaceAll(/\s/g, '-').replace(/[^\w-]/g, '').toLowerCase().trim();
export const sanitize = (text) => text.replace(/ *\([^)]*\)/g, "").trim();

export const formatPercent = (v, d = 0) => Number(v).toLocaleString('en-US', { style: 'percent', minimumFractionDigits: d });
export const formatComma = (v) => Number(v).toLocaleString('en-US');
export const formatDecimal = (v) => Number(v).toFixed(2);

export const shortenAnswerline = (answerline) =>
  answerline
    .split("[")[0]
    .replace(/ *\([^)]*\)/g, "")
    .trim();
export const removeTags = (text) => text.replace(/(<([^>]+)>)/gi, "");

export const getNavOptions = function(round, number, tournamentRounds) {
  let prev = tournamentRounds[tournamentRounds.findIndex(r => r.number === round) - 1];
  let next = tournamentRounds[tournamentRounds.findIndex(r => r.number === round) + 1];

  return {
      previous: (prev || number > 1) ? {
          round: number > 1 ? round : prev.number,
          number: number > 1 ? number - 1 : 20
      } : null,
      next: (next || number < 20) ? {
          round: number < 20 ? round : next.number,
          number: number < 20 ? number + 1 : 1
      } : null
  }
}