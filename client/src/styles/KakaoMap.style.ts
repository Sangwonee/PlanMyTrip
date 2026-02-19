import styled from "styled-components";

export const KakaoContainer = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;

  .map {
    width: 100%;
    height: 100%;
  }
`;

export const MarkerTooltip = styled.div<{ $color: string }>`
  width: 200px;
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(6px);
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  z-index: 1000;
  white-space: normal;
  text-align: left;

  /* 호버 애니메이션 */
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  .place {
    font-weight: bold;
    color: black;
    font-size: 14px;
    margin-top: 4px;
  }

  .activity {
    font-weight: 500;
    margin-top: 5px;
    margin-bottom: 3px;
    color: black;
    font-size: 12px;
  }

  .description {
    color: rgb(13, 13, 13);
    font-size: 11px;
  }

  img {
    width: 100%;
    min-height: 100px;
    max-height: 300px;
    border-radius: 6px;
  }
`;

export const CustomMarker = styled.div<{ $color: string }>`
  --marker-size: 30px;
  display: flex;
  align-items: center;
  z-index: 100;
  justify-content: center;
  width: var(--marker-size);
  height: var(--marker-size);
  border: 1px solid white;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  backdrop-filter: blur(5px);
  color: white;
  box-shadow: 0 0 3px 1px gray;
`;
