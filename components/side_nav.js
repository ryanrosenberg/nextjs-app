import Scrollspy from "react-scrollspy";
import { slug } from "../lib/utils";
import styles from "./side_nav.module.css";

export default function SideNav({ headers }) {
  return (
    <div className="side-nav">
      <Scrollspy
        items={headers.map((header) => (slug(header)))}
        currentClassName="is-current"
      >
        {headers.map((header) => (<li>
          <a href={"#" + slug(header)} key = {slug(header)}>{header}</a>
        </li>))}
      </Scrollspy>
    </div>
  );
}
