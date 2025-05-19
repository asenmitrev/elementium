import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { Hero } from "types";
import HeroCard from "./hero";
import { createNoise2D } from "simplex-noise";

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

  // Use a fixed seed for deterministic terrain
  const createNoise = createNoise2D(() => 0.5); // Fixed seed for deterministic noise
  const noise = (nx: number, ny: number) => {
    // Simplex noise returns values in [-1, 1], so shift to [0, 1]
    return (createNoise(nx * 5, ny * 5) + 1) / 2;
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
    const centerX = Math.floor(mapWidth * (0.1 + (0.8 * (i % 10)) / 10));
    const centerY = Math.floor(
      mapHeight * (0.1 + (0.8 * Math.floor(i / 10)) / 5)
    );
    const size = 15; // Fixed size for water bodies

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
    const centerX = Math.floor(mapWidth * (0.1 + (0.8 * (i % 10)) / 10));
    const centerY = Math.floor(
      mapHeight * (0.1 + (0.8 * Math.floor(i / 10)) / 4)
    );
    const size = 10; // Fixed size for volcanic regions

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
  myHero?: {
    _id: string;
    name: string;
    x: number | null;
    y: number | null;
  };
  onHeroMove?: (
    x: number,
    y: number,
    terrainType: TerrainType
  ) => Promise<void>;
}

const Map: React.FC<MapProps> = ({ initialScale = 1, myHero, onHeroMove }) => {
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
  const requestRef = useRef<number | null>(null);
  const [scale, setScale] = useState(initialScale);
  const [isZooming, setIsZooming] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const baseTileSize = 30; // Base tile size before scaling
  const tileSize = baseTileSize * scale; // Apply scale to tile size
  const mapWidth = mapData[0].length;
  const mapHeight = mapData.length;

  // Center the map on initial load
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPosition({
        x: width / 2,
        y: height / 2,
      });
    }
  }, [tileSize]);

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

  // Handle map click to move hero
  const handleMapClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging || !containerRef.current || !onHeroMove || !myHero) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert click coordinates to map coordinates
      const mapX = Math.floor((clickX - position.x) / tileSize);
      const mapY = Math.floor((clickY - position.y) / tileSize);

      // Check if the clicked position is within map bounds
      const mapWidth = mapData[0].length;
      const mapHeight = mapData.length;
      const worldX = mapX + Math.floor(mapWidth / 2);
      const worldY = mapY + Math.floor(mapHeight / 2);

      if (
        worldX >= 0 &&
        worldX < mapWidth &&
        worldY >= 0 &&
        worldY < mapHeight
      ) {
        const terrainType = mapData[worldY][worldX];
        setIsMoving(true);
        onHeroMove(mapX, mapY, terrainType)
          .then(() => {
            setIsMoving(false);
          })
          .catch((error) => {
            console.error("Failed to move hero:", error);
            setIsMoving(false);
          });
      }
    },
    [isDragging, position, tileSize, mapData, onHeroMove, myHero]
  );

  // Center the map on myHero on initial load
  useEffect(() => {
    if (
      containerRef.current &&
      myHero &&
      myHero.x !== null &&
      myHero.y !== null
    ) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      // Calculate pixel position of myHero
      const heroPixelX = myHero.x * tileSize;
      const heroPixelY = myHero.y * tileSize;
      setPosition({
        x: width / 2 - heroPixelX,
        y: height / 2 - heroPixelY,
      });
    } else if (containerRef.current) {
      // fallback: center (0,0)
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPosition({
        x: width / 2,
        y: height / 2,
      });
    }
  }, [myHero, tileSize]);

  return (
    <div
      className="relative overflow-hidden w-full h-screen border border-gray-300 rounded-md"
      ref={containerRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onWheel={handleWheel}
      onClick={handleMapClick}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <div className="absolute inset-0">
        {renderVisibleTiles()}

        {/* Hero marker */}
        {myHero && myHero.x !== null && myHero.y !== null && (
          <div
            className={clsx(
              "absolute hero-marker rounded-full bg-blue-600 border-4 border-white flex items-center justify-center z-20 shadow-lg transition-transform duration-300",
              isMoving && "animate-pulse"
            )}
            style={{
              width: `${Math.max(48, 24 * scale)}px`,
              height: `${Math.max(48, 24 * scale)}px`,
              transform: `translate3d(${
                myHero.x * tileSize +
                position.x +
                tileSize / 2 -
                Math.max(24, 12 * scale)
              }px, ${
                myHero.y * tileSize +
                position.y +
                tileSize / 2 -
                Math.max(24, 12 * scale)
              }px, 0)`,
              fontSize: `${Math.max(12, scale * 12)}px`,
            }}
            title={myHero.name + " (You)"}
          >
            <span className="font-bold text-white">You</span>
            <svg
              className="ml-1"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="12" cy="12" r="5" fill="white" />
            </svg>
          </div>
        )}

        {/* Origin marker showing (0,0) */}
        <div
          className="absolute rounded-full bg-black border-2 border-white z-20"
          style={{
            width: `${Math.max(8, 4 * scale)}px`,
            height: `${Math.max(8, 4 * scale)}px`,
            transform: `translate3d(${position.x - Math.max(4, 2 * scale)}px, ${
              position.y - Math.max(4, 2 * scale)
            }px, 0)`,
            willChange: isDragging || isZooming ? "transform" : "auto",
          }}
          title="Origin (0,0)"
        />
      </div>

      {/* Zoom indicator */}
      <div className="absolute left-4 bottom-4 bg-black bg-opacity-80 px-3 py-1 rounded-full text-sm">
        Zoom: {Math.round(scale * 100)}%
      </div>

      {/* Zoom controls */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-30">
        <button
          onClick={zoomIn}
          className="bg-black p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none"
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
          className="bg-black p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none"
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
          className="bg-black p-2 rounded-full shadow hover:bg-gray-100 focus:outline-none"
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
  );
};

export default Map;
