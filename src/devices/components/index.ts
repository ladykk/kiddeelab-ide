import { ComponentDetail } from "../../types/component";
import DCMotor from "./dc_motor";
import DHT from "./dht";
import RCServo from "./rc_servo";
import RGBLED from "./rgb_led";
import SevenSegment from "./seven_segment";
import Ultrasonic from "./ultrasonic";

const componentLists: Array<ComponentDetail> = [
  SevenSegment,
  Ultrasonic,
  DHT,
  RGBLED,
  RCServo,
  DCMotor,
].sort((a, b) => (a.name > b.name ? 1 : -1));

export default componentLists;
