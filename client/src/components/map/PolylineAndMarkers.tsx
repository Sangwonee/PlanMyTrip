import React, { useState } from "react";
import { Polyline, CustomOverlayMap } from "react-kakao-maps-sdk";
import * as S from "../../styles/KakaoMap.style";
import type { PlaceDataType } from "../../types/api";

interface PolylineAndMarkersPropsType {
  places: PlaceDataType[];
  color: string;
  keyPrefix: string;
}

const PolylineAndMarkers: React.FC<PolylineAndMarkersPropsType> = ({
  places,
  color,
  keyPrefix,
}) => {
  const [hoveredPlace, setHoveredPlace] = useState<PlaceDataType | null>(null);

  const validPoints = places
    .filter(
      ({ longitude, latitude }) =>
        !isNaN(longitude ?? 0) && !isNaN(latitude ?? 0)
    )
    .map(({ longitude, latitude }) => ({
      lng: longitude ?? 0,
      lat: latitude ?? 0,
    }));

  return (
    <React.Fragment key={keyPrefix}>
      <Polyline
        path={validPoints}
        strokeWeight={5}
        strokeOpacity={1}
        strokeColor={color}
        strokeStyle="dashed"
      />

      {places.map((item, index) => {
        const {
          order,
          longitude,
          latitude,
          place,
          description,
          activity,
          image,
        } = item;

        if (isNaN(longitude ?? 0) || isNaN(latitude ?? 0)) return null;

        const position = { lng: longitude!, lat: latitude! };
        const key = `${keyPrefix}-${index}-${place}-${longitude}-${latitude}`;

        return (
          <React.Fragment key={key}>
            <CustomOverlayMap position={position} yAnchor={0.5}>
              <S.CustomMarker
                $color={color}
                onMouseEnter={() => setHoveredPlace(item)}
                onMouseLeave={() => setHoveredPlace(null)}
              >
                {order && order !== 0 ? order : index + 1}
              </S.CustomMarker>
            </CustomOverlayMap>

            {hoveredPlace?.place === place && hoveredPlace?.order === order && (
              <CustomOverlayMap position={position} yAnchor={1}>
                <S.MarkerTooltip $color={color}>
                  <img src={image ?? ""} alt={`${place} 이미지`} />
                  <div className="place">
                    {order && order !== 0 ? order : index + 1}. {place}
                  </div>
                  <div className="activity">{activity}</div>
                  <div className="description">{description}</div>
                </S.MarkerTooltip>
              </CustomOverlayMap>
            )}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};

export default PolylineAndMarkers;
