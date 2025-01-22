"use client";

interface Resources {
  elementium: number;
}

export default function CastleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto p-4">{children}</div>;
}
