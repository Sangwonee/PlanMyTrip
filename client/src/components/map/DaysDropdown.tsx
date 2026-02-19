import React, { useEffect, useRef, useState } from "react";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import * as S from "../../styles/map/DaysDropdown.style";

interface FormatDaysType {
  label: string;
  value: string | null;
}

interface DaysDropdownPropsType {
  selectedDay: string | null;
  formatDays: FormatDaysType[];
  onClickSelectDay: (day: string | null) => void;
}

const DaysDropdown: React.FC<DaysDropdownPropsType> = ({
  selectedDay,
  formatDays,
  onClickSelectDay,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#000000");

  const { colors, changeColor } = useTravelScheduleStore();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <S.SelectWrapper ref={dropdownRef}>
      <S.SelectViewValue onClick={() => setOpen(!open)}>
        {formatDays.find((d) => d.value === selected)?.label ?? "전체"}
      </S.SelectViewValue>

      {open && (
        <S.SelectOptionList>
          {formatDays.map(({ label, value }, idx) => {
            const colorIndex = idx - 1;
            const color = colorIndex >= 0 ? colors[colorIndex] : null;

            const isSelected = selectedDay === value;

            return (
              <S.SelectOptionItem
                key={`${value}-${idx}`}
                $isSelected={isSelected}
                onClick={() => {
                  setSelected(value);
                  onClickSelectDay(value);
                  setOpen(false);

                  if (color) {
                    setSelectedColor(color);
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{label}</span>

                  {isSelected && value && (
                    <S.MarkerColorBox>
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (colorIndex >= 0) {
                            changeColor(selectedColor, colorIndex);
                          }
                        }}
                      >
                        변경
                      </button>
                    </S.MarkerColorBox>
                  )}
                </div>
              </S.SelectOptionItem>
            );
          })}
        </S.SelectOptionList>
      )}
    </S.SelectWrapper>
  );
};

export default DaysDropdown;
