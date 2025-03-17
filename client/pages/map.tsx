import { GetServerSideProps } from "next";
import ProtectedRoute from "@/components/protected-route";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}, // will be passed to the page component as props
  };
};

export default function Map() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold">Are be bobe, kude e mapa</h1>
      </div>
    </ProtectedRoute>
  );
}
