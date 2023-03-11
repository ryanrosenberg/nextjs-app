import parse from "html-react-parser";
import Link from "next/link";

export default function RawHtml({ html }) {
    try {
        const new_string = parse(html, {
            replace: (domNode) => {
              if (domNode.attribs && domNode.attribs.href) {
                return (
                  <Link href={domNode.attribs.href}>{domNode.children[0].data}</Link>
                );
              }
            },
          });
          return new_string;
    }

    catch {
        return html;
    }
}
