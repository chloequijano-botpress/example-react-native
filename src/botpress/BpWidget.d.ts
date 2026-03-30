import type { FC } from "react";

export interface BpWidgetProps {
  botConfig: Record<string, unknown>;
  onMessage?: (e: { nativeEvent: { data: string } }) => void;
}

declare const BpWidget: FC<BpWidgetProps>;

export default BpWidget;
