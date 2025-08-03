import { PusherBeamsService } from "../domain/interfaces/services/PusherBeamsService";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { createContext } from "react";

export interface PusherBeamsState {
  client: PusherPushNotifications.Client | undefined;
  service: PusherBeamsService | undefined;
}

export const PusherBeamsContext = createContext<PusherBeamsState>({
  client: undefined,
  service: undefined,
});
