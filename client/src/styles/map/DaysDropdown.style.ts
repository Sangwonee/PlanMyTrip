import styled from "styled-components";

export const SelectWrapper = styled.div`
  min-width: 200px;
  position: absolute;
  top: 0;
  left: 0;
  margin: 10px;
  z-index: 2;
`;

export const SelectViewValue = styled.div`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  color: black;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.1s ease-out;

  &:hover {
    transform: scale(1.02);
  }
`;

export const SelectOptionList = styled.ul`
  position: absolute;
  z-index: 10;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 4px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  color: black;
`;

export const SelectOptionItem = styled.li<{ $isSelected: boolean }>`
  padding: 8px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "rgba(0, 0, 0, 0.08)" : "transparent"};

  &:hover {
    background-color: ${({ $isSelected }) =>
      $isSelected ? "" : "rgba(147, 147, 147, 0.05)"};
  }
`;

export const SelectedColorBox = styled.div<{ $color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
  border: 1px solid #ccc;
`;

export const MarkerColorBox = styled.div`
  display: flex;
  align-items: center;

  input[type="color"] {
    width: 16px;
    height: 16px;
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
    appearance: none;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
      border-radius: 50%;
    }

    &::-webkit-color-swatch {
      border: none;
      border-radius: 50%;
    }
  }

  button {
    margin-left: 8px;
    padding: 4px 8px;
    cursor: pointer;
    border: 1px solid #888;
    border-radius: 4px;
    background-color: #eee;
  }
`;
