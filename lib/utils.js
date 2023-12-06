// export function slug(str) {
//   const new_str = str.replaceAll(" ", "-").toLowerCase();
//   return new_str;
// }
import Link from "next/link";
import * as ra from "radash";

export function linkify(column_type, val) {
  const cleaned_val = val == "" || val === null ? "-" : val;
  let final_val = cleaned_val;

  switch(column_type){
    case 'School':
        final_val = <a href={'../schools/' + slugify(cleaned_val)}>{cleaned_val}</a>
        break;
    case'Player':
        final_val = <a href={'../players/' + slugify(cleaned_val)}>{cleaned_val}</a>
        break;
    default:
        final_val = cleaned_val
  }

  return final_val;
}

export const renderCell = (item, column) => {
  let cellValue = item[column.accessor];

  if (column.format) cellValue = column.format(cellValue);

  if (column.html)
    cellValue = <span dangerouslySetInnerHTML={{ __html: cellValue }}></span>;

  if (column.linkTemplate)
    return (
      <Link href={ra.template(column.linkTemplate, item)}>{cellValue}</Link>
    );

  return cellValue;
};

export const slugify = (text) => text.replaceAll(/\s/g, '-').replace(/[^\w-]/g, '').toLowerCase().trim();
export const sanitize = (text) => text.replace(/ *\([^)]*\)/g, "").trim();

export const formatPercent = (v) => Number(v).toLocaleString('en-US', { style: 'percent' });
export const formatComma = (v) => Number(v).toLocaleString('en-US');
export const formatDecimal = (v) => Number(v).toFixed(2);