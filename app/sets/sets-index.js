'use client';

import EditorTable from "../../components/editor_table";
import _ from "lodash";

export default function SetsIndex({ result }) {
  const data = result.props.result;

  data.map((item) => {
    switch (item.difficulty) {
      case 1:
        item.difficulty = "<div class = 'diffdots easy-diff'>&#x25CF;</div>";
        break;
      case 2:
        item.difficulty =
          "<div class = 'diffdots medium-diff'>&#x25CF;&#x25CF;</div>";
        break;
      case 3:
        item.difficulty =
          "<div class = 'diffdots regionals-diff'>&#x25CF;&#x25CF;&#x25CF;</div>";
        break;
      case 4:
        item.difficulty =
          "<div class = 'diffdots nationals-diff'>&#x25CF;&#x25CF;&#x25CF;&#x25CF;</div>";
        break;
    }
    return item;
  });
  return (
    <>
      <div>
        <h1 className="page-title">Sets</h1>
        <EditorTable data={data} />
      </div>
    </>
  );
}