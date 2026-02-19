import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaCheck } from "react-icons/fa6";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

type MultiSelectProps = {
  label?: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
};

const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: rgba(0, 0, 0, 0.7);
  text-align: left;
  margin-right: 7px;
  font-weight: bold;
`;

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  padding: 8px 12px;
  background: #fff;
  cursor: pointer;
  user-select: none;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: inherit;

  .tagList {
    display: flex;
    gap: 3px;
    align-items: center;
    flex: 1;
    overflow: hidden;
  }

  .tag {
    padding: 3px 8px;
    border-radius: 99px;
    font-size: 12px;
    background-color: #b7d37a;
    color: white;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .placeholder {
    color: #999;
  }
`;

const Arrow = styled.span`
  margin-left: 8px;
  font-size: 12px;
  flex-shrink: 0;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  text-align: left;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  cursor: pointer;

  .check {
    color: #b7d37a;
  }

  &:hover {
    background-color: #f5f5f5;
  }
`;

// 임시 요소를 만들어서 텍스트 너비를 측정하는 함수
const measureTextWidth = (
  text: string,
  fontSize: string = "12px",
  fontFamily: string = "inherit"
): number => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;

  context.font = `${fontSize} ${fontFamily}`;
  return context.measureText(text).width;
};

// 태그의 전체 너비를 계산하는 함수 (패딩 포함)
const getTagWidth = (text: string): number => {
  const textWidth = measureTextWidth(text, "12px");
  const padding = 16; // 3px + 8px 좌우 패딩
  return textWidth + padding;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const calculateVisibleTags = () => {
      if (!tagListRef.current || selected.length === 0) return;

      const containerWidth = tagListRef.current.offsetWidth;
      const gap = 3; // 태그 간 간격
      const moreTagWidth = getTagWidth("+99개"); // 최대 너비로 계산

      let totalWidth = 0;
      let count = 0;

      for (let i = 0; i < selected.length; i++) {
        const tagWidth = getTagWidth(selected[i]);
        const needsMoreTag = i < selected.length - 1;
        const requiredWidth =
          totalWidth + tagWidth + (needsMoreTag ? gap + moreTagWidth : 0);

        if (requiredWidth > containerWidth && count > 0) {
          break;
        }

        totalWidth += tagWidth + (i > 0 ? gap : 0);
        count++;
      }

      setVisibleCount(Math.max(1, count));
    };

    // ResizeObserver를 사용하여 컨테이너 크기 변화 감지
    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleTags();
    });

    if (tagListRef.current) {
      resizeObserver.observe(tagListRef.current);
    }

    // 초기 계산
    calculateVisibleTags();

    return () => {
      resizeObserver.disconnect();
    };
  }, [selected]);

  const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const visibleTags = selected.slice(0, visibleCount);
  const hiddenCount = selected.length - visibleCount;

  return (
    <Container ref={containerRef}>
      {label && <Label>{label}</Label>}
      <SelectBox onClick={() => setOpen((prev) => !prev)}>
        <div className="tagList" ref={tagListRef}>
          {selected.length > 0 ? (
            <>
              {visibleTags.map((str) => (
                <span key={str} className="tag">
                  {str}
                </span>
              ))}
              {hiddenCount > 0 && <span className="tag">+{hiddenCount}개</span>}
            </>
          ) : (
            <span className="placeholder">선택하세요</span>
          )}
        </div>
        <Arrow>{open ? <IoIosArrowUp /> : <IoIosArrowDown />}</Arrow>
      </SelectBox>
      {open && (
        <Menu>
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <Option key={option} onClick={() => handleToggle(option)}>
                <span>{option}</span>
                {isSelected ? <FaCheck className="check" /> : ""}
              </Option>
            );
          })}
        </Menu>
      )}
    </Container>
  );
};

export default MultiSelect;
