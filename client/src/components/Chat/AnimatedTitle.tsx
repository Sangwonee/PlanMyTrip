import React from "react";
import * as S from "../../styles/LoddingBubble.style";

const AnimatedTitle: React.FC = () => {
  return (
    <S.AnimatedBrandTitle>
      <img
        src="/brand/PLANDL_horizontal_logo.png"
        alt="PLANDL 로고"
        style={{ width: 120, height: "auto", display: "block" }}
      />
    </S.AnimatedBrandTitle>
  );
};

export default AnimatedTitle;
