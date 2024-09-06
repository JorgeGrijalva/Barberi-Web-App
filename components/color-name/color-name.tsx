import { GetColorName } from "hex-color-to-color-name";

const ColorName = ({ color }: { color: string }) => GetColorName(color);

export default ColorName;
