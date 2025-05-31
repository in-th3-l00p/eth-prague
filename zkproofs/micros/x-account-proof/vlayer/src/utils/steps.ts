import {
  ConnectWalletStep,
  ProveStep,
  SuccessStep,
  WelcomeScreen,
  InstallExtension,
} from "../components";

export type Step = {
  kind: STEP_KIND;
  path: string;
  backUrl?: string;
  component: React.ComponentType;
  index: number;
};

export enum STEP_KIND {
  WELCOME,
  CONNECT_WALLET,
  START_PROVING,
  INSTALL_EXTENSION,
  SUCCESS,
}
export const steps: Step[] = [
  {
    path: "",
    kind: STEP_KIND.WELCOME,
    component: WelcomeScreen,
    index: 0,
  },
  {
    path: "connect-wallet",
    kind: STEP_KIND.CONNECT_WALLET,
    backUrl: "/",
    component: ConnectWalletStep,
    index: 1,
  },
  {
    path: "start-proving",
    kind: STEP_KIND.START_PROVING,
    backUrl: "/connect-wallet",
    component: ProveStep,
    index: 2,
  },
  {
    path: "install-extension",
    kind: STEP_KIND.INSTALL_EXTENSION,
    component: InstallExtension,
    backUrl: "/connect-wallet",
    index: 2,
  },
  {
    path: "success",
    kind: STEP_KIND.SUCCESS,
    component: SuccessStep,
    index: 3,
  },
];
