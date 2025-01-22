import Link from "next/link";
import Image from "next/image";

export default function BuildingHeader({
  title,
  imageUrl,
  castleId,
}: {
  title: string;
  imageUrl: string;
  castleId: string;
}) {
  return (
    <div className="relative w-full h-64">
      <Image
        src={imageUrl}
        alt="Castle Banner"
        fill
        className="object-cover rounded-lg"
        priority
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent rounded-lg" />
      <h1 className="text-2xl font-bold mb-4 absolute top-4 left-6 ">
        <Link
          href={`/castle/${castleId}`}
          className="text-sm hover:underline text-white"
        >
          ← {title}
        </Link>
      </h1>
    </div>
  );
}
