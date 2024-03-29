'use client'

import React, { useState } from "react";
import styles from "./search_bar.module.css";
import Fuse from "fuse.js";
import { slug } from "../lib/utils";

export default function SearchBar({ value }) {
  var json = require("../refresh-index.json");

  const options = {
    keys: ["name"],
    minMatchCharLength: 2,
    threshold: 0.2,
  };

  const [query, updateQuery] = useState("");
  const myIndex = Fuse.createIndex(options.keys, json);
  // initialize Fuse with the index
  const fuse = new Fuse(json, options, myIndex);

  var result = fuse.search(query);

  if(result.length >= 10){
    result = result.slice(0, 10);
  }
  function onSearch({ currentTarget }) {
    updateQuery(currentTarget.value);
  }

  return (
    <div>
      <input
        className={styles.searchBar}
        placeholder="Search..."
        value={value}
        onChange={onSearch}
      />
      <div className={result.length > 0 ? styles.searchResult : ""}>
        {result.map((en) => (
          <a href={`../${slugify(en.item.type)}/${en.item.slug}`}>
            <div className={styles.searchResultEntry}>
              {en.item.name}{" "}
              <i className={styles.description}>{en.item.description}</i>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
