import Image from "next/image";
import { ConnectWallet } from "@/components/ui/connect-wallet";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      {/* Background pattern */}
      <svg 
        className="absolute inset-0 -z-10 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" 
        aria-hidden="true"
      >
        <defs>
          <pattern 
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7" 
            width="200" 
            height="200" 
            x="50%" 
            y="-1" 
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          strokeWidth="0" 
          fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" 
        />
      </svg>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">ETH Prague</span>
          </div>

          {/* Badge */}
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm/6 font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                What's new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600">
                <span>Just shipped v1.0</span>
                <svg className="size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path 
                    fillRule="evenodd" 
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </span>
            </a>
          </div>

          {/* Main heading */}
          <h1 className="mt-10 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
            Build the future with Web3
          </h1>
          
          {/* Description */}
          <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
            Connect your wallet and experience the next generation of decentralized applications. 
            Built with viem and wagmi for seamless Ethereum integration.
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex items-center gap-x-6">
            <ConnectWallet />
            <a 
              href="#" 
              className="text-sm/6 font-semibold text-gray-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Hero image section */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <div className="w-[76rem] max-w-full aspect-video rounded-md shadow-2xl ring-1 ring-gray-900/10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-2xl font-bold mb-2">Web3 Dashboard</h3>
                  <p className="text-lg opacity-80">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
