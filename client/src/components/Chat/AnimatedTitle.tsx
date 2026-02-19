import React, { useEffect, useState } from "react";
import * as S from "../../styles/LoddingBubble.style";

const AnimatedTitle: React.FC = () => {
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const totalDuration = "Plan My Trip".length * 200 + 1000;
    const interval = setInterval(() => {
      setResetKey((prev) => prev + 1);
    }, totalDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <S.AnimatedBrandTitle key={resetKey}>
      {"Plan My Trip".split("").map((char, idx) => (
        <S.AnimatedLetter key={idx} $delay={idx * 0.1}>
          {char === " " ? "\u00A0" : char}
        </S.AnimatedLetter>
      ))}
    </S.AnimatedBrandTitle>
  );
};

export default AnimatedTitle;
