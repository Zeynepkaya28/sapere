// Builds the two map views (world and Turkey) as SVG path strings on the server.
// Nothing is fetched at runtime: shapes come from the world-atlas package, so the page
// keeps its strict CSP and the browser downloads no map library.

import {
  geoCentroid,
  geoContains,
  geoMercator,
  geoNaturalEarth1,
  geoPath,
  type GeoProjection,
} from "d3-geo";
import type { Feature, FeatureCollection, Geometry, MultiPolygon } from "geojson";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import countries110 from "world-atlas/countries-110m.json";
import countries50 from "world-atlas/countries-50m.json";
import type { Fact } from "@/content/facts";

export type MapViewId = "world" | "turkey";

export type MapPin = {
  factId: string;
  /** Position as a percentage of the view's width and height, so pins stay finger-sized. */
  x: number;
  y: number;
};

export type MapView = {
  id: MapViewId;
  width: number;
  height: number;
  land: string;
  borders: string;
  /** Turkey's outline, drawn in a warmer colour. */
  home: string;
  pins: MapPin[];
  /** World view only: one bubble standing in for every pin inside Turkey. */
  cluster?: { x: number; y: number; count: number };
};

type Countries = Topology<{ countries: GeometryCollection; land: GeometryCollection }>;

const TURKEY_ID = "792";
const ANTARCTICA_ID = "010";
const WIDTH = 960;

function countriesOf(topology: Countries): Feature<Geometry, { name: string }>[] {
  const fc = feature(topology, topology.objects.countries) as unknown as FeatureCollection<
    Geometry,
    { name: string }
  >;
  return fc.features;
}

/** All land as one shape, without Antarctica (it only takes space on a fact map). */
function landOf(topology: Countries): Feature<MultiPolygon> {
  const fc = feature(topology, topology.objects.land) as unknown as FeatureCollection<MultiPolygon>;
  const polygons = fc.features.flatMap((f) => f.geometry.coordinates);
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "MultiPolygon",
      coordinates: polygons.filter((poly) => poly[0].some(([, lat]) => lat > -60)),
    },
  };
}

function bordersOf(topology: Countries) {
  return mesh(topology, topology.objects.countries, (a, b) => a !== b);
}

function turkeyOf(list: Feature<Geometry, { name: string }>[]) {
  const tr = list.find((f) => f.id === TURKEY_ID);
  if (!tr) throw new Error("Turkey missing from world-atlas");
  return tr;
}

function pinsFor(list: Fact[], project: GeoProjection, width: number, height: number) {
  const out: MapPin[] = [];
  for (const fact of list) {
    if (!fact.place) continue;
    const p = project([fact.place.lon, fact.place.lat]);
    if (!p) continue;
    const [x, y] = p;
    if (x < 0 || y < 0 || x > width || y > height) continue;
    out.push({ factId: fact.id, x: round((x / width) * 100), y: round((y / height) * 100) });
  }
  return out;
}

const round = (n: number) => Math.round(n * 100) / 100;

const turkey50 = turkeyOf(countriesOf(countries50 as unknown as Countries));

/** True when a fact's place lies inside Turkey (uses the detailed 1:50m outline). */
export function isInTurkey(fact: Fact): boolean {
  return !!fact.place && geoContains(turkey50, [fact.place.lon, fact.place.lat]);
}

function buildWorld(list: Fact[]): MapView {
  const topology = countries110 as unknown as Countries;
  const all = countriesOf(topology).filter((f) => f.id !== ANTARCTICA_ID);
  const shapes: FeatureCollection = { type: "FeatureCollection", features: all };

  const projection = geoNaturalEarth1().fitWidth(WIDTH, shapes);
  // Whole pixels are enough at world scale and halve the markup.
  const path = geoPath(projection).digits(0);
  const height = Math.ceil(path.bounds(shapes)[1][1]);

  const inTurkey = list.filter(isInTurkey);
  const outside = list.filter((f) => !isInTurkey(f));
  const [cx, cy] = projection(geoCentroid(turkey50))!;

  return {
    id: "world",
    width: WIDTH,
    height,
    land: path(landOf(topology)) ?? "",
    borders: path(bordersOf(topology)) ?? "",
    home: path(turkeyOf(all)) ?? "",
    pins: pinsFor(outside, projection, WIDTH, height),
    cluster: inTurkey.length
      ? { x: round((cx / WIDTH) * 100), y: round((cy / height) * 100), count: inTurkey.length }
      : undefined,
  };
}

function buildTurkey(list: Fact[]): MapView {
  const topology = countries50 as unknown as Countries;
  const height = 480;
  const pad = 36;

  const projection = geoMercator()
    .fitExtent(
      [
        [pad, pad],
        [WIDTH - pad, height - pad],
      ],
      turkey50,
    )
    .clipExtent([
      [0, 0],
      [WIDTH, height],
    ]);
  const path = geoPath(projection).digits(1);
  const shapes: FeatureCollection = {
    type: "FeatureCollection",
    features: countriesOf(topology),
  };

  return {
    id: "turkey",
    width: WIDTH,
    height,
    land: path(shapes) ?? "",
    borders: path(bordersOf(topology)) ?? "",
    home: path(turkey50) ?? "",
    pins: pinsFor(list.filter(isInTurkey), projection, WIDTH, height),
  };
}

let cache: { key: Fact[]; views: MapView[] } | undefined;

/** Both views, computed once per server process for a given fact list. */
export function getMapViews(list: Fact[]): MapView[] {
  if (cache?.key !== list) cache = { key: list, views: [buildWorld(list), buildTurkey(list)] };
  return cache.views;
}
