import HeroList from "@/components/hero-list";
import { mockHeroes } from "@/mocks/heroes";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies["accessToken"];

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

export default function Heroes() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Hero List</h1>
      <HeroList heroes={mockHeroes} />
    </main>
  );
}
