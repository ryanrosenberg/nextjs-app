'use client'

import EditorTable from "../../components/editor_table";

export default function SetsIndex({ result }) {
  const data = result.props.result;
  console.log(data);
  return (
    <>
      <div>
        <h1 className="page-title">Sets</h1>
        <EditorTable data = {data} />
      </div>
    </>
  );
}