import { Round } from "../types";

export const slugify = (text: string) =>
  text.replace(" ", "-").replace(/\W/g, "").toLowerCase().trim();
export const sanitize = (text: string) =>
  text.replace(/ *\([^)]*\)/g, "").trim();
export const shortenAnswerline = (answerline: string) =>
  answerline
    .split("[")[0]
    .replace(/ *\([^)]*\)/g, "")
    .trim();
export const removeTags = (text: string) => text.replace(/(<([^>]+)>)/gi, "");

export const formatPercent = (v: any) =>
  v?.toLocaleString("en-US", { style: "percent" });
export const formatDecimal = (v: any) => v?.toFixed(2);

export const getNavOptions = function (tossup_id: number) {
  return {
    previous: { id: tossup_id > 1 ? tossup_id - 1 : null },
    next: { id: tossup_id + 1 },
  };
};
