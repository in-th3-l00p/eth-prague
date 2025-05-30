export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10">
        <header>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="rounded-lg border-4 border-dashed border-gray-200 p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Propellant!</h2>
                  <p className="text-gray-600 mb-6">
                    You've successfully signed up. This is where you'll manage your creator tokens and fan engagement.
                  </p>
                  <div className="space-y-4">
                    <button className="inline-flex items-center rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-pink-700">
                      Launch Your Token
                    </button>
                    <div>
                      <button className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Connect Social Media
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 