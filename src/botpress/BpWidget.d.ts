import type { ForwardRefExoticComponent, RefAttributes } from "react";

export interface BpWidgetRef {
  sendEvent: (event: { type: string }) => void;
  sendPayload: (payload: { type: string; text?: string }) => void;
  mergeConfig: (config: Record<string, unknown>) => void;
}

export interface BpWidgetProps {
  botConfig: Record<string, unknown>;
  onMessage?: (e: { nativeEvent: { data: string } }) => void;
}

declare const BpWidget: ForwardRefExoticComponent<BpWidgetProps & RefAttributes<BpWidgetRef | null>>;

export default BpWidget;
