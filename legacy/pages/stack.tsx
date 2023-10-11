import { drawPathStack } from "@/utils/canvas/draw-path-stack";
import { NX } from "@/utils/models/ripples/constants";
import { evolve } from "@/utils/models/ripples/lib";
import { Inter } from "next/font/google";
import React, { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [row, setRow] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const initialState = [];
  for (let i = 0; i < NX; i++) {
    initialState.push(0.2 * Math.random());
  }

  const [h, setH] = useState(initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current) {
        drawPathStack(h, 2 * row, canvasRef.current);
        const { h: hOut } = evolve(h);
        setH(hOut);
        setRow(row + 1);
      }
    }, 40);
    return () => {
      clearInterval(interval);
    };
  }, [h, row]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-8 ${inter.className}`}
    >
      <div className={`flex flex-col max-w-xl p-4`}>
        <div className={`flex flex-grow`}>
          <canvas
            className={`flex max-w-full`}
            width={550}
            height={360}
            ref={canvasRef}
          ></canvas>
        </div>
        <section className="flex flex-col gap-4 text-sm mt-8">
          <h1 className="flex items-start font-bold text-xl">
            Ripples in wind-blown sand
          </h1>
          <p>
            {
              "A simulated sand bed might take on a 'rippled' state if the conditions are right. The bed evolves through 'saltation' - the downwind movement of individual grains - coupled with localized 'diffusion' that keeps the bed relatively smooth."
            }
          </p>
          <p>
            {
              "Grains at higher elevations are transported farther, and grains on leeward slopes aren't transported at all."
            }
          </p>
        </section>
      </div>
    </main>
  );
}
