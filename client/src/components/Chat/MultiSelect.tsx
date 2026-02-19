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
  gap: 6px;
`;

const Label = styled.label`
  color: var(--color-accent-dark);
  font-weight: 600;
  font-size: 0.82em;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  padding: 10px 14px;
  background: var(--color-bg);
  cursor: pointer;
  user-select: none;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: inherit;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);

  &:hover {
    border-color: var(--color-accent);
    background: #fff;
  }

  .tagList {
    display: flex;
    gap: 4px;
    align-items: center;
    flex: 1;
    overflow: hidden;
  }

  .tag {
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 11px;
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
    border: 1px solid var(--color-border-hover);
    white-space: nowrap;
    flex-shrink: 0;
    font-weight: 600;
  }

  .placeholder { color: var(--color-text-muted); }
`;

const Arrow = styled.span`
  margin-left: 8px;
  font-size: 12px;
  flex-shrink: 0;
  color: var(--color-text-muted);
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  width: 100%;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-secondary);
  box-shadow: var(--shadow-hover);
  max-height: 220px;
  overflow-y: auto;
  z-index: 1000;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  color: var(--color-text-secondary);
  font-size: 13.5px;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
  }

  .check { color: var(--color-accent); font-size: 11px; }
`;

const measureTextWidth = (text: string, fontSize = "12px", fontFamily = "inherit"): number => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return 0;
  ctx.font = `${fontSize} ${fontFamily}`;
  return ctx.measureText(text).width;
};

const getTagWidth = (text: string) => measureTextWidth(text, "11px") + 16;

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const tagListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const calc = () => {
      if (!tagListRef.current || !selected.length) return;
      const w = tagListRef.current.offsetWidth;
      const moreW = getTagWidth("+99개");
      let total = 0, count = 0;
      for (let i = 0; i < selected.length; i++) {
        const tw = getTagWidth(selected[i]);
        const needed = total + tw + (i < selected.length - 1 ? 4 + moreW : 0);
        if (needed > w && count > 0) break;
        total += tw + (i > 0 ? 4 : 0);
        count++;
      }
      setVisibleCount(Math.max(1, count));
    };
    const ro = new ResizeObserver(calc);
    if (tagListRef.current) ro.observe(tagListRef.current);
    calc();
    return () => ro.disconnect();
  }, [selected]);

  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);

  return (
    <Container ref={containerRef}>
      {label && <Label>{label}</Label>}
      <SelectBox onClick={() => setOpen((p) => !p)}>
        <div className="tagList" ref={tagListRef}>
          {selected.length > 0 ? (
            <>
              {selected.slice(0, visibleCount).map((s) => <span key={s} className="tag">{s}</span>)}
              {selected.length - visibleCount > 0 && <span className="tag">+{selected.length - visibleCount}개</span>}
            </>
          ) : (
            <span className="placeholder">선택하세요</span>
          )}
        </div>
        <Arrow>{open ? <IoIosArrowUp /> : <IoIosArrowDown />}</Arrow>
      </SelectBox>
      {open && (
        <Menu>
          {options.map((o) => (
            <Option key={o} onClick={() => toggle(o)}>
              <span>{o}</span>
              {selected.includes(o) && <FaCheck className="check" />}
            </Option>
          ))}
        </Menu>
      )}
    </Container>
  );
};

export default MultiSelect;
