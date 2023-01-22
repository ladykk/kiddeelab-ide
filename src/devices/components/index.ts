import { ComponentDetail } from "../../types/component";
import DHT from "./dht";
import SevenSegment from "./seven_segment";
import Ultrasonic from "./ultrasonic";

const componentLists: Array<ComponentDetail> = [
  SevenSegment,
  Ultrasonic,
  DHT,
].sort((a, b) => (a.name > b.name ? 1 : -1));

export default componentLists;
