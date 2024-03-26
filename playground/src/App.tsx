import "./App.css";
import { backmoji, createImageRenderer } from "backmoji";
import { useEffect, useRef, useState } from "react";
import Paw from "./assets/paw.svg";

function App() {
  const [image, setImage] = useState<HTMLImageElement>();
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadImage(Paw).then((image) => {
      setImage(image);
    });
  }, []);

  useEffect(() => {
    if (image) {
      const pawRenderer = createImageRenderer(image);
      const { canvas, render, setSize } = backmoji(pawRenderer);
      backgroundRef.current?.appendChild(canvas);
      setSize({ w: 500, h: 500 });
      render();
    }
  }, [image]);

  function loadImage(src: string) {
    return new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        resolve(image);
      };
    });
  }

  return (
    <div ref={backgroundRef}>
      <section className="h-screen flex items-center justify-center">
        <h1 className="font-bold text-7xl md:text-8xl lg:text-9xl text-orange-500">
          Backmoji
        </h1>
      </section>
    </div>
  );
}

export default App;
