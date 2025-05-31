import {
  ConnectWalletStep,
  LaunchStep,
  ProveFollowersStep,
  SuccessStep,
  WelcomeScreen,
  InstallExtension,
} from "../components";

export type Step = {
  kind: STEP_KIND;
  path: string;
  backUrl?: string;
  component: React.ComponentType;
  title: string;
  description: string;
  headerIcon?: string;
  index: number;
};

export enum STEP_KIND {
  WELCOME,
  CONNECT_WALLET,
  INSTALL_EXTENSION,
  START_SCREEN_NAME_PROVING,
  START_FOLLOWERS_COUNT_PROVING,
  START_LAUNCHING,
  SUCCESS,
}
export const steps: Step[] = [
  {
    path: "",
    kind: STEP_KIND.WELCOME,
    component: WelcomeScreen,
    title: "Token launcher",
    description: "Launch a token with your X account. Only owner of account can launch a token for specific handle..",
    headerIcon: "/nft-illustration.svg",
    index: 0,
  },
  {
    path: "connect-wallet",
    kind: STEP_KIND.CONNECT_WALLET,
    backUrl: "",
    component: ConnectWalletStep,
    title: "Connect wallet",
    description:
      "To proceed to the next step, please connect your wallet now by clicking the button below.",
    index: 1,
  },
  {
    path: "install-extension",
    kind: STEP_KIND.INSTALL_EXTENSION,
    component: InstallExtension,
    backUrl: "/connect-wallet",
    title: "X NFT",
    description: `Install vlayer browser extension to proceed to the next step. \n`,
    index: 1,
  },
  {
    path: "start-screen-name-proving",
    kind: STEP_KIND.START_SCREEN_NAME_PROVING,
    backUrl: "/connect-wallet",
    component: ProveFollowersStep,
    title: "Screen name proving",
    description:
      "Open vlayer browser extension and follow instructions in order to produce the Proof of X account ownership. \n",
    headerIcon: "/nft-illustration.svg",
    index: 2,
  },
  {
    path: "start-followers-count-proving",
    kind: STEP_KIND.START_FOLLOWERS_COUNT_PROVING,
    backUrl: "/start-screen-name-proving",
    component: ProveFollowersStep,
    title: "Followers count proving",
    description: `Install vlayer browser extension to proceed to the next step. \n`,
    headerIcon: "/nft-illustration.svg",
    index: 3,
  },
  {
    path: "start-launching",
    kind: STEP_KIND.START_LAUNCHING,
    backUrl: "/start-followers-count-proving",
    component: LaunchStep,
    title: "Launching",
    description: `You are all set to launch your token.`,
    headerIcon: "/nft-illustration.svg",
    index: 3,
  },
  {
    path: "success",
    kind: STEP_KIND.SUCCESS,
    component: SuccessStep,
    title: "Success",
    description: "",
    headerIcon: "/nft-illustration.svg",
    index: 4,
  },
];
