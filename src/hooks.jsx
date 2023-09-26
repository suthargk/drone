import React from "react";

export function useMapImage({ mapState, url, name }) {
  React.useEffect(() => {
    if (mapState) {
      const map = mapState.getMap();

      map.loadImage(url, (error, image) => {
        if (error) throw error;
        if (!map.hasImage(name)) map.addImage(name, image, { sdf: true });
      });
    }
  }, [mapState]);
}
