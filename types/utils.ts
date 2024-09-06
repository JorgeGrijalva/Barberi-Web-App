import { NextPage } from "next";
import React, { ReactElement, ReactNode } from "react";

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  stroke?: string;
}
export type IconType = React.FC<IconBaseProps>;

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
