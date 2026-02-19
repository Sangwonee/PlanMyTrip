import React, { useCallback, useEffect, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import * as S from "../../styles/KakaoMap.style";
import useKakaoLoader from "../../hooks/useKakaoLoader";
import PolylineAndMarkers from "./PolylineAndMarkers";
import { useTravelScheduleStore } from "../../store/travelScheduleStore";
import type { PlaceDataType } from "../../types/api";

type PlaceList = Record<string, PlaceDataType[]>;

interface KakaoMapProps {
  placeList: PlaceList;
  day?: string | null;
}

const KakaoMap: React.FC<KakaoMapProps> = ({ placeList, day }) => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [initialCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const { colors } = useTravelScheduleStore();

  useKakaoLoader();

  const handleMapCreate = useCallback((mapInstance: kakao.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const getColor = (targetDay: string): string => {
    const days = Object.keys(placeList);
    const dayIndex = days.indexOf(targetDay);
    return dayIndex !== -1 ? colors[dayIndex % colors.length] : colors[0];
  };

  useEffect(() => {
    if (!map) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    let shouldSetBounds = false;

    const addToBounds = (places: PlaceDataType[]) => {
      places.forEach(({ longitude, latitude }) => {
        if (!isNaN(longitude ?? 0) && !isNaN(latitude ?? 0)) {
          bounds.extend(
            new window.kakao.maps.LatLng(latitude ?? 0, longitude ?? 0)
          );
          shouldSetBounds = true;
        }
      });
    };

    if (day && placeList[day]) {
      addToBounds(placeList[day]);
    } else {
      Object.values(placeList).forEach(addToBounds);
    }

    if (shouldSetBounds) {
      map.setBounds(bounds);
    }
  }, [map, placeList, day]);

  return (
    <S.KakaoContainer>
      <Map
        className="map"
        center={initialCenter}
        level={3}
        onCreate={handleMapCreate}
      >
        {day && placeList[day] ? (
          <PolylineAndMarkers
            places={placeList[day]}
            color={getColor(day)}
            keyPrefix={day}
          />
        ) : (
          Object.entries(placeList).map(([day, places]) =>
            places.length > 0 ? (
              <PolylineAndMarkers
                places={placeList[day]}
                color={getColor(day)}
                keyPrefix={day}
              />
            ) : null
          )
        )}
      </Map>
    </S.KakaoContainer>
  );
};

export default KakaoMap;
