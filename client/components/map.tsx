import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Hero } from "types";
import HeroCard from "./hero";

// Define terrain types
export enum TerrainType {
  WATER = "water",
  EARTH = "earth",
  FIRE = "fire",
}

// Define map tile interface
interface MapTile {
  type: TerrainType;
}

// Generate mock map data (500x500 = 250,000 tiles)
const generateMapData = (): TerrainType[][] => {
  const mapWidth = 500;
  const mapHeight = 500;
  const map: TerrainType[][] = [];

  // Simple Perlin-like noise implementation
  const noise = (nx: number, ny: number) => {
    // Generate a value between 0 and 1 based on coordinates
    const value = Math.sin(nx * 10) * Math.sin(ny * 10) * 0.5 + 0.5;
    return value;
  };

  // Generate initial random map with more natural-looking clusters
  for (let y = 0; y < mapHeight; y++) {
    const row: TerrainType[] = [];
    for (let x = 0; x < mapWidth; x++) {
      // Normalize coordinates to 0-1 range for noise function
      const nx = x / mapWidth;
      const ny = y / mapHeight;

      // Get noise value for this position
      const noiseValue = noise(nx, ny);

      // Assign terrain based on noise value
      let type: TerrainType;
      if (noiseValue < 0.33) {
        type = TerrainType.WATER;
      } else if (noiseValue < 0.66) {
        type = TerrainType.EARTH;
      } else {
        type = TerrainType.FIRE;
      }

      row.push(type);
    }
    map.push(row);
  }

  // Create more water bodies for larger map
  for (let i = 0; i < 50; i++) {
    const centerX = Math.floor(Math.random() * mapWidth);
    const centerY = Math.floor(Math.random() * mapHeight);
    const size = Math.floor(Math.random() * 15) + 8; // 8-23 tiles

    for (let y = centerY - size / 2; y < centerY + size / 2; y++) {
      for (let x = centerX - size / 2; x < centerX + size / 2; x++) {
        // Apply a distance check to make more circular shapes
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        if (
          distance <= size / 2 &&
          y >= 0 &&
          y < mapHeight &&
          x >= 0 &&
          x < mapWidth
        ) {
          map[Math.floor(y)][Math.floor(x)] = TerrainType.WATER;
        }
      }
    }
  }

  // Create more volcanic regions for larger map
  for (let i = 0; i < 40; i++) {
    const centerX = Math.floor(Math.random() * mapWidth);
    const centerY = Math.floor(Math.random() * mapHeight);
    const size = Math.floor(Math.random() * 12) + 5; // 5-17 tiles

    for (let y = centerY - size / 2; y < centerY + size / 2; y++) {
      for (let x = centerX - size / 2; x < centerX + size / 2; x++) {
        // Apply a distance check to make more circular shapes
        const distance = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );
        if (
          distance <= size / 2 &&
          y >= 0 &&
          y < mapHeight &&
          x >= 0 &&
          x < mapWidth
        ) {
          map[Math.floor(y)][Math.floor(x)] = TerrainType.FIRE;
        }
      }
    }
  }

  return map;
};

// Map component props
interface MapProps {
  initialScale?: number;
  heroes?: Hero[];
  onHeroClick?: (hero: Hero) => void;
  onBattle?: (hero: Hero, terrain: TerrainType) => void;
}

// Hero Modal Component
interface HeroModalProps {
  hero: Hero | null;
  isOpen: boolean;
  onClose: () => void;
  onBattle?: (hero: Hero, terrain: TerrainType) => void;
  getTerrainAtCoordinates: (x: number, y: number) => TerrainType | null;
}

const HeroModal: React.FC<HeroModalProps> = ({
  hero,
  isOpen,
  onClose,
  onBattle,
  getTerrainAtCoordinates,
}) => {
  if (!isOpen || !hero) return null;

  const handleBattle = () => {
    if (onBattle && hero.x !== null && hero.y !== null) {
      const terrain = getTerrainAtCoordinates(hero.x, hero.y);
      onBattle(hero, terrain || TerrainType.EARTH); // Default to EARTH if terrain can't be determined
      onClose(); // Close the modal after starting battle
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{hero.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4">
            <HeroCard
              hero={hero.type}
              units={hero.units?.map((unit) => unit.type) || []}
              heroId={hero._id}
              noLink={true}
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-black">
              {hero.x !== null && hero.y !== null
                ? `(${hero.x}, ${hero.y})`
                : "Not on map"}
            </p>
            {hero.x !== null && hero.y !== null && (
              <p className="text-sm text-gray-500 mt-1">
                Land type:{" "}
                <span className="font-semibold text-black">
                  {getTerrainAtCoordinates(hero.x, hero.y) ?? "Unknown"}
                </span>
              </p>
            )}
          </div>

          {onBattle && hero.x !== null && hero.y !== null && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleBattle}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Battle
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Map: React.FC<MapProps> = ({
  initialScale = 1,
  heroes = [],
  onHeroClick,
  onBattle,
}) => {
  const [mapData] = useState(generateMapData());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleTiles, setVisibleTiles] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requestRef = useRef<number | null>(null);
  const [scale, setScale] = useState(initialScale);
  const [isZooming, setIsZooming] = useState(false);

  const baseTileSize = 30; // Base tile size before scaling
  const tileSize = baseTileSize * scale; // Apply scale to tile size
  const mapWidth = mapData[0].length;
  const mapHeight = mapData.length;

  // Center the map on initial load
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Center position so (0,0) is at the center of the viewport
      setPosition({
        x: width / 2,
        y: height / 2,
      });
    }
  }, []);

  // Calculate which tiles are visible in the viewport
  const calculateVisibleTiles = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Calculate the visible tile range, supporting negative coordinates
    // The zero point (0,0) is at the center of the map
    const centerX = position.x;
    const centerY = position.y;

    // Calculate bounds in world coordinates, accounting for scale
    const startX = Math.floor((0 - centerX) / tileSize);
    const startY = Math.floor((0 - centerY) / tileSize);
    const endX = Math.ceil((containerRect.width - centerX) / tileSize);
    const endY = Math.ceil((containerRect.height - centerY) / tileSize);

    setVisibleTiles({ startX, startY, endX, endY });
  }, [position, tileSize]);

  // Update visible tiles when position or scale changes
  useEffect(() => {
    calculateVisibleTiles();
  }, [position, scale, calculateVisibleTiles]);

  // Set up resize observer to recalculate visible tiles when container size changes
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      calculateVisibleTiles();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [calculateVisibleTiles]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      // Don't start dragging if we clicked directly on a hero
      if ((e.target as HTMLElement).closest(".hero-marker")) {
        return;
      }

      setIsDragging(true);
      setStartPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position]
  );

  const handleDragMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      // Cancel any pending animation frame
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }

      // Schedule the position update
      requestRef.current = requestAnimationFrame(() => {
        setPosition({
          x: e.clientX - startPosition.x,
          y: e.clientY - startPosition.y,
        });
        requestRef.current = null;
      });
    },
    [isDragging, startPosition]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("mouseleave", handleDragEnd);

    return () => {
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("mouseleave", handleDragEnd);
    };
  }, [handleDragEnd]);

  // Clean up requestAnimationFrame on unmount
  useEffect(() => {
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Handle wheel event for zooming
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      // Cancel any pending animation frame
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }

      requestRef.current = requestAnimationFrame(() => {
        const delta = e.deltaY;
        const zoomFactor = 0.1; // How much to zoom per scroll
        const newScale = Math.max(
          0.2, // Minimum scale
          Math.min(
            3.0, // Maximum scale
            scale + (delta > 0 ? -zoomFactor : zoomFactor)
          )
        );

        // Get mouse position relative to container
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the offset from the mouse pointer to the current center
        const offsetX = mouseX - position.x;
        const offsetY = mouseY - position.y;

        // Calculate the zoomed offset
        const scaleFactor = newScale / scale;
        const newOffsetX = offsetX * scaleFactor;
        const newOffsetY = offsetY * scaleFactor;

        // Update position to zoom toward mouse cursor
        setPosition({
          x: mouseX - newOffsetX,
          y: mouseY - newOffsetY,
        });

        setScale(newScale);
        setIsZooming(true);

        // Reset zooming flag after a short delay
        setTimeout(() => {
          setIsZooming(false);
        }, 200);

        requestRef.current = null;
      });
    },
    [scale, position]
  );

  // Add zoom controls
  const zoomIn = useCallback(() => {
    const zoomFactor = 0.2;
    const newScale = Math.min(3.0, scale + zoomFactor);

    if (newScale !== scale) {
      setScale(newScale);
      setIsZooming(true);

      // When zooming with buttons, zoom toward center of viewport
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const offsetX = centerX - position.x;
        const offsetY = centerY - position.y;

        const scaleFactor = newScale / scale;
        const newOffsetX = offsetX * scaleFactor;
        const newOffsetY = offsetY * scaleFactor;

        setPosition({
          x: centerX - newOffsetX,
          y: centerY - newOffsetY,
        });
      }

      setTimeout(() => {
        setIsZooming(false);
      }, 200);
    }
  }, [scale, position]);

  const zoomOut = useCallback(() => {
    const zoomFactor = 0.2;
    const newScale = Math.max(0.2, scale - zoomFactor);

    if (newScale !== scale) {
      setScale(newScale);
      setIsZooming(true);

      // When zooming with buttons, zoom toward center of viewport
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const offsetX = centerX - position.x;
        const offsetY = centerY - position.y;

        const scaleFactor = newScale / scale;
        const newOffsetX = offsetX * scaleFactor;
        const newOffsetY = offsetY * scaleFactor;

        setPosition({
          x: centerX - newOffsetX,
          y: centerY - newOffsetY,
        });
      }

      setTimeout(() => {
        setIsZooming(false);
      }, 200);
    }
  }, [scale, position]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setIsZooming(true);

    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPosition({
        x: width / 2,
        y: height / 2,
      });
    }

    setTimeout(() => {
      setIsZooming(false);
    }, 200);
  }, []);

  // Get terrain type at a specific coordinate
  const getTerrainAtCoordinates = useCallback(
    (x: number, y: number): TerrainType | null => {
      const mapX = x + Math.floor(mapWidth / 2);
      const mapY = y + Math.floor(mapHeight / 2);

      if (
        mapX >= 0 &&
        mapX < mapWidth &&
        mapY >= 0 &&
        mapY < mapHeight &&
        mapData[mapY] &&
        mapData[mapY][mapX] !== undefined
      ) {
        return mapData[mapY][mapX];
      }
      return null;
    },
    [mapData, mapWidth, mapHeight]
  );

  const handleHeroClick = (hero: Hero) => {
    setSelectedHero(hero);
    setIsModalOpen(true);

    if (onHeroClick) {
      onHeroClick(hero);
    }
  };

  const handleBattleClick = (hero: Hero) => {
    if (onBattle && hero.x !== null && hero.y !== null) {
      const terrain = getTerrainAtCoordinates(hero.x, hero.y);
      onBattle(hero, terrain || TerrainType.EARTH); // Default to EARTH if terrain can't be determined
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedHero(null);
  };

  const getTileColor = (type: TerrainType): string => {
    switch (type) {
      case TerrainType.WATER:
        return "/images/tiles/water.png";
      case TerrainType.EARTH:
        return "/images/tiles/earth.png";
      case TerrainType.FIRE:
        return "/images/tiles/fire.png";
      default:
        return "bg-gray-300";
    }
  };

  // Update renderVisibleTiles to use scaled tile size
  const renderVisibleTiles = () => {
    const tiles = [];
    const maxTiles = 2000;
    let tileCount = 0;

    const totalTiles =
      (visibleTiles.endX - visibleTiles.startX + 1) *
      (visibleTiles.endY - visibleTiles.startY + 1);

    // Use a higher skip factor when zoomed out to improve performance
    const baseSkipFactor =
      totalTiles > maxTiles ? Math.ceil(totalTiles / maxTiles) : 1;

    // When zoomed out significantly, we can skip more tiles
    const scaleAdjustedSkipFactor = Math.max(
      baseSkipFactor,
      scale < 0.5 ? Math.ceil(1 / scale) : 1
    );

    for (let y = visibleTiles.startY; y <= visibleTiles.endY; y++) {
      for (let x = visibleTiles.startX; x <= visibleTiles.endX; x++) {
        if (
          (y - visibleTiles.startY) % scaleAdjustedSkipFactor !== 0 ||
          (x - visibleTiles.startX) % scaleAdjustedSkipFactor !== 0
        ) {
          continue;
        }

        const mapX = x + Math.floor(mapWidth / 2);
        const mapY = y + Math.floor(mapHeight / 2);

        if (
          mapX >= 0 &&
          mapX < mapWidth &&
          mapY >= 0 &&
          mapY < mapHeight &&
          mapData[mapY] &&
          mapData[mapY][mapX] !== undefined
        ) {
          const type = mapData[mapY][mapX];
          const imagePath = getTileColor(type);
          tiles.push(
            <div
              key={`${x}-${y}`}
              className={clsx(
                "absolute",
                isDragging || isZooming ? "" : "transition-colors duration-200"
              )}
              style={{
                width: tileSize * scaleAdjustedSkipFactor,
                height: tileSize * scaleAdjustedSkipFactor,
                transform: `translate3d(${x * tileSize + position.x}px, ${
                  y * tileSize + position.y
                }px, 0)`,
                willChange: isDragging || isZooming ? "transform" : "auto",
                backgroundImage: `url(${imagePath})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              title={`${type} (${x},${y})`}
            />
          );
          tileCount++;
        } else if (!isDragging && !isZooming) {
          tiles.push(
            <div
              key={`${x}-${y}`}
              className="absolute bg-gray-200 opacity-30"
              style={{
                width: tileSize * scaleAdjustedSkipFactor,
                height: tileSize * scaleAdjustedSkipFactor,
                transform: `translate3d(${x * tileSize + position.x}px, ${
                  y * tileSize + position.y
                }px, 0)`,
              }}
              title={`Out of bounds (${x},${y})`}
            />
          );
          tileCount++;
        }

        if (tileCount >= maxTiles) {
          break;
        }
      }

      if (tileCount >= maxTiles) {
        break;
      }
    }

    return tiles;
  };

  // Update hero markers to account for zoom
  const renderHeroMarkers = () => {
    return heroes
      .filter(
        (hero) =>
          hero.x !== null &&
          hero.y !== null &&
          hero.x >= visibleTiles.startX &&
          hero.x <= visibleTiles.endX &&
          hero.y >= visibleTiles.startY &&
          hero.y <= visibleTiles.endY
      )
      .map((hero) => (
        <div
          key={hero._id}
          className="absolute hero-marker rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
          style={{
            width: `${Math.max(40, 20 * scale)}px`,
            height: `${Math.max(40, 20 * scale)}px`,
            transform: `translate3d(${
              hero.x! * tileSize +
              position.x +
              tileSize / 2 -
              Math.max(20, 10 * scale)
            }px, ${
              hero.y! * tileSize +
              position.y +
              tileSize / 2 -
              Math.max(20, 10 * scale)
            }px, 0)`,
            fontSize: `${Math.max(10, scale * 10)}px`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleHeroClick(hero);
          }}
          title={hero.name}
        >
          <span className="font-bold">{hero.name}</span>
        </div>
      ));
  };

  return (
    <>
      <div
        className="relative overflow-hidden w-full h-screen border border-gray-300 rounded-md"
        ref={containerRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <div className="absolute inset-0">
          {renderVisibleTiles()}
          {!isDragging && renderHeroMarkers()}

          {/* Origin marker showing (0,0) */}
          <div
            className="absolute rounded-full bg-black border-2 border-white z-20"
            style={{
              width: `${Math.max(8, 4 * scale)}px`,
              height: `${Math.max(8, 4 * scale)}px`,
              transform: `translate3d(${
                position.x - Math.max(4, 2 * scale)
              }px, ${position.y - Math.max(4, 2 * scale)}px, 0)`,
              willChange: isDragging || isZooming ? "transform" : "auto",
            }}
            title="Origin (0,0)"
          />
        </div>

        {/* Zoom indicator */}
        <div className="absolute left-4 bottom-4 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm">
          Zoom: {Math.round(scale * 100)}%
        </div>

        {/* Zoom controls */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-30">
          <button
            onClick={zoomIn}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none"
            title="Zoom in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button
            onClick={resetZoom}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none"
            title="Reset zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={zoomOut}
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none"
            title="Zoom out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 12H6"
              />
            </svg>
          </button>
        </div>
      </div>

      <HeroModal
        hero={selectedHero}
        isOpen={isModalOpen}
        onClose={closeModal}
        onBattle={onBattle}
        getTerrainAtCoordinates={getTerrainAtCoordinates}
      />
    </>
  );
};

export default Map;
