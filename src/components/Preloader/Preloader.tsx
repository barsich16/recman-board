import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./Preloader.scss";

type PreloaderProps = {
  onFinish: () => void;
};

const TEXT = "Recman Board";

const Preloader: React.FC<PreloaderProps> = ({ onFinish }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const getElements = () => {
    const q = gsap.utils.selector(rootRef);

    return {
      inner: q(".preloader-inner")[0],
      letters: q(".preloader__letter"),
      bar: q(".preloader__bar")[0],
      counterEl: q(".preloader__counter")[0],
    };
  };

  const createTimeline = (
    inner: Element,
    letters: Element[],
    bar: Element,
    counterEl: Element | null,
  ) => {
    const counter = { value: 0 };

    return gsap
      .timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.to(rootRef.current, {
            y: "-100%",
            duration: 0.8,
            ease: "power4.inOut",
            onComplete: onFinish,
          });
        },
      })
      .fromTo(
        inner,
        { scale: 0.9, y: 60, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1 },
      )
      .fromTo(
        letters,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.04, duration: 0.6 },
        "-=0.7",
      )
      .to(
        counter,
        {
          value: 100,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            if (counterEl) {
              counterEl.textContent = Math.floor(counter.value) + "%";
            }
          },
        },
        "-=1",
      )
      .to(
        bar,
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.inOut",
        },
        "<",
      );
  };

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const { inner, letters, bar, counterEl } = getElements();
      createTimeline(inner, letters, bar, counterEl);
    }, rootRef);

    return () => ctx.revert();
  }, [onFinish]);

  return (
    <div ref={rootRef} className="preloader">
      <div className="preloader-inner">
        <div className="preloader__text">
          {TEXT.split(" ").map((word, wi) => (
            <span key={wi} className="preloader__word">
              {word.split("").map((char, ci) => (
                <span key={ci} className="preloader__letter">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>

        <div className="preloader__progress">
          <div className="preloader__bar" />
        </div>

        <div className="preloader__counter">0%</div>
      </div>
    </div>
  );
};

export default Preloader;
