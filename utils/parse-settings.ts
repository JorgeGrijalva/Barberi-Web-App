import { Setting } from "@/types/global";

export const parseSettings = (settings?: Setting[]): Record<string, string> =>
  settings
    ? Object.assign({}, ...settings.map((setting) => ({ [setting.key]: setting.value })))
    : {};
