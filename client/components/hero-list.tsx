import type React from "react";
import type { Hero } from "@/types";
import Image from "next/image";
import { Brain, Feather, Shield, Zap } from "lucide-react";
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { CarouselContent } from "./ui/carousel";

interface HeroListProps {
  heroes: Hero[];
}

const HeroList: React.FC<HeroListProps> = ({ heroes }) => {
  return (
    <Carousel className="w-full mb-6">
      <CarouselContent>
        {heroes.map((hero, index) => (
          <CarouselItem
            key={index}
            className="md:basis-1/3 lg:basis-1/3 xl:basis-1/4"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={hero.type.image}
                alt={`Hero ${index + 1}`}
                width={200}
                height={200}
                className="w-full object-cover"
              />
              <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4">Hero {index + 1}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>wind: {hero.type.wind}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Feather className="w-5 h-5 text-blue-500" />
                    <span>water: {hero.type.water}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-red-500" />
                    <span>earth: {hero.type.earth}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <span>fire: {hero.type.fire}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    Level: {hero.type.level}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      hero.alive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {hero.alive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default HeroList;
