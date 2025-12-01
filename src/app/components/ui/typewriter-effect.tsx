"use client";

import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect } from "react";
import { candara } from '@/app/fonts/index';

type Word = {
  text: string;
  className?: string;
};

type Props = {
  words: Word[];
  className?: string;
  cursorClassName?: string;
  ativaPipe?: boolean
};

export const TypewriterEffect = ({ words, className, cursorClassName, ativaPipe }: Props) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
        },
        {
          duration: 0.3,
          delay: stagger(0.05),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView] /* eslint-disable-line react-hooks/exhaustive-deps */);

  return (
    <div
      ref={scope}
      className={`${candara.className} text-base md:text-xl lg:text-5xl font-bold text-center ${className || ''}`}
    >
      <div className="inline">
        {wordsArray.map((word, idx) => (
          <div key={idx} className="inline-block">
            {word.text.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                className={`opacity-0 ${word.className || ''}`}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </div>
        ))}
      </div>
      {ativaPipe && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
            className={`inline-block w-2px h-6 md:h-8 lg:h-10 bg-green-500 ml-1 ${cursorClassName || ''}`}
          />

      )}
    </div>
  );
};
