export function findCoordsCenter(coords: [number, number][]): [number, number] {
  const [sumLng, sumLat] = coords.reduce(
    ([accLng, accLat], [lng, lat]) => [accLng + lng, accLat + lat],
    [0, 0],
  );
  return [sumLng / coords.length, sumLat / coords.length];
}
