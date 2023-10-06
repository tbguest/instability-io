import { Footer } from "@/components/Footer";
import { ripplesScroll } from "@/utils/canvas/ripples-scroll";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Translate() {
  const screenCanvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    screenCanvasRef?.current &&
      ripplesScroll(screenCanvasRef.current, bufferCanvasRef.current);
  }, []);

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Head>
        <title>Instability I/O</title>
        <meta property="og:title" content={"Instability I/O"} key="title" />
      </Head>
      <main className={`flex flex-col items-center p-8 ${inter.className}`}>
        <div className={`flex flex-col max-w-xl p-4`}>
          <div className={`flex flex-grow`}>
            <canvas
              className={`flex max-w-full`}
              width={550}
              height={360}
              ref={screenCanvasRef}
            ></canvas>
            <canvas
              width={550}
              height={360}
              ref={bufferCanvasRef}
              style={{ display: "none" }}
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
