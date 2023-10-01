import { Footer } from "@/components/Footer";
import { drawPathQuill } from "@/utils/canvas/draw-path-quill";
import { evolve, initialize } from "@/utils/models/ripples/lib";
import { Inter } from "next/font/google";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Quill() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate the initial bed state, with a "roughness" height
  const initialState = initialize(0.2);
  const initialState2 = [...initialState];
  initialState2[0] += 0.1;
  const [elevation, setElevation] = useState(initialState);
  const [slope, setSlope] = useState(initialState);
  const [elevation2, setElevation2] = useState(initialState2);
  const [slope2, setSlope2] = useState(initialState2);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current) {
        drawPathQuill(elevation, slope, 150, canvasRef.current, false);
        drawPathQuill(elevation2, slope2, 250, canvasRef.current, true);
        const { h, slope: theta } = evolve(elevation);
        const { h: h2, slope: theta2 } = evolve(elevation2);
        setElevation(h);
        setSlope(theta);
        setElevation2(h2);
        setSlope2(theta2);
      }
    }, 40);
    return () => {
      clearInterval(interval);
    };
  }, [elevation, slope, elevation2, slope2]);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Head>
        <title>Instability IO</title>
        <meta property="og:title" content={"Instability IO"} key="title" />
      </Head>
      <main className={`flex flex-col items-center p-8 ${inter.className}`}>
        <div className={`flex flex-col max-w-xl p-4`}>
          <div className={`flex flex-grow`}>
            <canvas
              className={`flex max-w-full`}
              width={550}
              height={360}
              ref={canvasRef}
            ></canvas>
          </div>
          <section className="flex flex-col gap-4 text-sm">
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
      <Footer />
    </div>
  );
}
