import Site from "../src/components/Site";
const { loadContent } = require("../src/lib/content.server.cjs");

export async function getStaticProps() {
  return { props: { content: loadContent() } };
}

export default function Index({ content }) {
  return <Site content={content} />;
}
