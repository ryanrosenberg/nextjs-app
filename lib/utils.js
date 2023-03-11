import Link from "next/link";

export function slug(str) {
  const new_str = str.replaceAll(" ", "-").toLowerCase();
  return new_str;
}

export function linkify(column_type, val) {
  const cleaned_val = val == "" || val === null ? "-" : val;
  let final_val = cleaned_val;

  switch(column_type){
    case 'School':
        final_val = <Link href={'../schools/' + slug(cleaned_val)}>{cleaned_val}</Link>
        break;
    case'Player':
        final_val = <Link href={'../players/' + slug(cleaned_val)}>{cleaned_val}</Link>
        break;
    default:
        final_val = cleaned_val
  }

  return final_val;
}
