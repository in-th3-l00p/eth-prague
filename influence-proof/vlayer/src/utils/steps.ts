import {
  ConnectWalletStep,
  MintStep,
  ProveAccountStep,
  ProveEngagementStep,
  SuccessStep,
  WelcomeScreen,
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
  START_PROVING_ACCOUNT,
  START_PROVING_ENGAGEMENT,
  MINT,
  SUCCESS,
}
export const steps: Step[] = [
  {
    path: "",
    kind: STEP_KIND.WELCOME,
    component: WelcomeScreen,
    title: "X NFT",
    description:
      "Mint an NFT with your X account. Only owner of account can mint NFT for specific handle. This example demonstrates use of Web Proofs.",
    headerIcon: "/nft-illustration.svg",
    index: 0,
  },
  {
    path: "connect-wallet",
    kind: STEP_KIND.CONNECT_WALLET,
    backUrl: "/",
    component: ConnectWalletStep,
    title: "X NFT",
    description:
      "To proceed to the next step, please connect your wallet now by clicking the button below.",
    index: 1,
  },
  {
    path: "start-proving-account",
    kind: STEP_KIND.START_PROVING_ACCOUNT,
    backUrl: "/connect-wallet",
    component: ProveAccountStep,
    title: "X NFT",
    description:
      "Open vlayer browser extension and follow instructions in order to produce the Proof of X account ownership. \n",
    index: 2,
  },
  {
    path: "start-proving-engagement",
    kind: STEP_KIND.START_PROVING_ENGAGEMENT,
    backUrl: "/start-proving-account",
    component: ProveEngagementStep,
    title: "X NFT",
    description:
      "Open vlayer browser extension and follow instructions in order to produce the Proof of X account ownership. \n",
    index: 3,
  },
  {
    path: "mint",
    kind: STEP_KIND.MINT,
    backUrl: "/start-proving-engagement",
    component: MintStep,
    title: "X NFT",
    description: `You are all set to mint your unique X NFT, a true reflection of your verified identity.`,
    index: 4,
  },
  {
    path: "success",
    kind: STEP_KIND.SUCCESS,
    component: SuccessStep,
    title: "Success",
    description: "",
    headerIcon: "/success-illustration.svg",
    index: 5,
  },
];
