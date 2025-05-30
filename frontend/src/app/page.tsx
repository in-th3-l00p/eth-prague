import Header from '@/components/header'

export default function Home() {
  return (
    <>
      <Header />
      <div className="relative isolate overflow-hidden bg-white">
        <svg
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        >
          <defs>
            <pattern
              x="50%"
              y={-1}
              id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
              width={200}
              height={200}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <rect fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" width="100%" height="100%" strokeWidth={0} />
        </svg>
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Propellant</span>
            </div>
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-purple-600/10 px-3 py-1 text-sm/6 font-semibold text-purple-600 ring-1 ring-inset ring-purple-600/10">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-600">
                  <span>ZK-TLS proofs now live</span>
                  <span aria-hidden="true" className="text-gray-400">→</span>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
              Launch your creator token and engage your fans
            </h1>
            <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
              Transform your social influence into a tradeable asset. Your fans earn tokens for authentic engagement, 
              and early supporters can invest in your success. It's simple, secure social investing.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                Launch your token
              </a>
              <a href="#" className="text-sm/6 font-semibold text-gray-900">
                How it works <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <img
                  alt="Propellant platform screenshot showing creator token dashboard"
                  src="https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png"
                  width={2432}
                  height={1442}
                  className="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}