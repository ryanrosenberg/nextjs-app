import { useState, useEffect } from "react";

export const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState([]);

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll("h2, h3, h4"));

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

const getNestedHeadings = (headingElements) => {
  const nestedHeadings = [];

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === "H2") {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === "H3" && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
        items: [],
      });
    } else if (
      heading.nodeName === "H4" &&
      nestedHeadings[nestedHeadings.length - 1].items.length > 0
    ) {
      nestedHeadings[nestedHeadings.length - 1].items[
        nestedHeadings[nestedHeadings.length - 1].items.length - 1
      ].items.push({
        id,
        title,
      });
    }
  });

  return nestedHeadings;
};
