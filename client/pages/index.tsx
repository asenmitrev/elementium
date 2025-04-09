import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";
import { GetStaticProps } from "next";

export default function Home({
  allPostsData,
}: {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[];
}) {
  return (
    <section className={utilStyles.headingMd}>
      <p>
        <Link href="/castles">Castle View</Link>
      </p>
      <p>
        <Link href="/heroes">Heroes View</Link>
      </p>
    </section>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { redirect: { destination: "/castles", permanent: false } };
};
