import _ from "lodash";
import styles from "./side_nav.module.css";
import { useRef, useEffect, useState } from "react";
import { useHeadingsData } from "../hooks/useHeadingsData.js";

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef({});
  useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id) =>
        headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px 0px -40% 0px",
    });

    const headingElements = Array.from(document.querySelectorAll("h2, h3, h4"));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

const Headings = ({ headings, activeId }) => (
  <ul>
    {headings.map((heading) => (
      <li
        className={heading.id == activeId ? styles.activeLink : ""}
        key={heading.id}
      >
        <a
          href={`#${heading.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(`#${heading.id}`).scrollIntoView({
              behavior: "smooth",
            });
          }}
        >
          {heading.title}
        </a>
        {heading.items.length > 0 && (
          <ul>
            {heading.items.map((child, k) => (
              <li
                key={k}
                className={child.id == activeId ? styles.activeLink : ""}
              >
                <a
                  href={`#${child.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(`#${child.id}`).scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  {child.title}
                </a>
                {child.items.length > 0 && (
                  <ul>
                    {child.items.map((grandchild, l) => (
                      <li
                        key={l}
                        className={
                          grandchild.id == activeId ? styles.activeLink : ""
                        }
                      >
                        <a
                          href={`#${grandchild.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .querySelector(`#${grandchild.id}`)
                              .scrollIntoView({
                                behavior: "smooth",
                              });
                          }}
                        >
                          {grandchild.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
);

export default function NestedSideNav() {
  const [activeId, setActiveId] = useState();
  const { nestedHeadings } = useHeadingsData();
  useIntersectionObserver(setActiveId);

  return (
    <nav className={styles.sidenav}>
      <Headings headings={nestedHeadings} activeId={activeId} />
    </nav>
  );
}
