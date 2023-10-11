import { Footer } from "@/components/Footer";
import { scrollProfile } from "@/utils/canvas/scroll-profile";
import { Inter } from "next/font/google";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Translate() {
  const screenCanvasRef = useRef<HTMLCanvasElement>(null);
  const bufferCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    screenCanvasRef?.current &&
      scrollProfile(screenCanvasRef.current, bufferCanvasRef.current);
  }, []);

  return (
    <div className="flex flex-col">
      <Head>
        <title>Instability I/O</title>
        <meta property="og:title" content={"Instability I/O"} key="title" />
      </Head>
      <main
        className={`flex flex-col justify-around min-h-screen items-center p-8 ${inter.className}`}
      >
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
            <Link href="/ripples">
              <h2 className="font-bold text-lg underline">
                {"Ripples in wind-blown sand"}
              </h2>
            </Link>
            <Link href="/dunes">
              <h2 className="font-bold text-lg underline">
                {"1-d dunes automaton"}
              </h2>
            </Link>
            <Link href="/lorenz">
              <h2 className="font-bold text-lg underline">{"Lorenz"}</h2>
            </Link>
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
