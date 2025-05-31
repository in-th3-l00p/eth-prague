'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { WalletConnect } from '@/components/WalletConnect'
import { useAccount } from 'wagmi'
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  UsersIcon,
  PlusIcon,
  ArrowLeftIcon,
  WalletIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const stats = [
  { name: 'Total Earnings', value: '$12,405.91', change: '+4.75%', changeType: 'positive' },
  { name: 'Active Tokens', value: '3', change: '+1', changeType: 'positive' },
  { name: 'Total Holders', value: '1,247', change: '+12.3%', changeType: 'positive' },
  { name: 'Market Cap', value: '$89,432', change: '+8.2%', changeType: 'positive' },
]

const recentTokens = [
  {
    id: 1,
    name: 'CREATOR',
    symbol: 'CRT',
    price: '$0.45',
    change: '+12.5%',
    holders: 423,
    marketCap: '$45,230',
    status: 'Active'
  },
  {
    id: 2,
    name: 'CONTENT',
    symbol: 'CNT',
    price: '$0.32',
    change: '+8.7%',
    holders: 312,
    marketCap: '$28,940',
    status: 'Active'
  },
  {
    id: 3,
    name: 'FANBASE',
    symbol: 'FAN',
    price: '$0.18',
    change: '+5.2%',
    holders: 512,
    marketCap: '$15,262',
    status: 'Active'
  }
]

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function CreatorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [accountProof, setAccountProof] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  // Wallet connection hooks
  const { isConnected, isConnecting, address } = useAccount()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          router.push('/login')
          return
        }
        
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      } else if (session?.user) {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  // Check account proof when wallet is connected and user is loaded
  useEffect(() => {
    if (user && isConnected && address) {
      checkAccountProof(address)
    }
  }, [user, isConnected, address])

  const checkAccountProof = async (walletAddress?: string) => {
    if (!walletAddress) {
      // No wallet connected, redirect to verification
      router.push('/creator/verify')
      return
    }

    try {
      const { data, error } = await supabase
        .from('account_proofs')
        .select('*')
        .eq('wallet', walletAddress)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error checking account proof:', error)
        return
      }

      if (data && data.wallet && data.screen_name) {
        setAccountProof(data)
      } else {
        // No valid account proof found, redirect to verification page
        router.push('/creator/verify')
        return
      }
    } catch (error) {
      console.error('Error checking account proof:', error)
      router.push('/creator/verify')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading || isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user || !accountProof) {
    return null // Will redirect to verification or login
  }

  // Show wallet connection prompt if wallet is not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push('/dashboard')}
                  className="mr-2"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                <Link href="/creator" className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Creator Mode</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Wallet Connection */}
                <WalletConnect showBalance={true} />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-m-1.5 p-1.5 aspect-square">
                      <span className="sr-only">Open user menu</span>
                      <div className="size-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center aspect-square">
                        <span className="text-white font-semibold text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      Switch Mode
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Wallet Connection Prompt */}
        <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-orange-100 mb-6">
              <ExclamationTriangleIcon className="h-10 w-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Wallet Connection Required
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              You need to connect your wallet to access the Creator Dashboard. Your wallet is required for token management and blockchain interactions.
            </p>
            
            <Card className="mx-auto max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                  <WalletIcon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your Web3 wallet to continue with creator features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <WalletConnect 
                  variant="gradient" 
                  className="w-full justify-center py-3 text-lg"
                />
                <p className="text-sm text-gray-500 text-center">
                  Supported wallets: MetaMask, WalletConnect, and other Web3 wallets
                </p>
              </CardContent>
            </Card>

            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
                className="mr-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <Link href="/creator" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-bold text-gray-900">Creator Mode</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Wallet Connection */}
              <WalletConnect showBalance={true} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-m-1.5 p-1.5 aspect-square">
                    <span className="sr-only">Open user menu</span>
                    <div className="size-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center aspect-square">
                      <span className="text-white font-semibold text-sm">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    Switch Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Launch and manage your tokens
                {isConnected && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                    Wallet Connected
                  </span>
                )}
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              disabled={!isConnected}
              onClick={() => {
                if (!isConnected) {
                  alert('Please connect your wallet first to launch a new token.')
                  return
                }
                // Add token launch logic here
                console.log('Launching new token...')
              }}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              {!isConnected ? 'Connect Wallet to Launch' : 'Launch New Token'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={classNames(
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600',
                    'text-sm font-medium'
                  )}>
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <RocketLaunchIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Token Launcher</CardTitle>
                  <CardDescription>Create and deploy new tokens</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <CardDescription>Track token performance</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Community</CardTitle>
                  <CardDescription>Engage with token holders</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Tokens */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Tokens</CardTitle>
                <CardDescription>Manage your launched tokens</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Token</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Change</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Holders</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Market Cap</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTokens.map((token) => (
                    <tr key={token.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{token.name}</div>
                          <div className="text-sm text-gray-500">{token.symbol}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">{token.price}</td>
                      <td className="py-4 px-4">
                        <span className="text-green-600 font-medium">{token.change}</span>
                      </td>
                      <td className="py-4 px-4">{token.holders.toLocaleString()}</td>
                      <td className="py-4 px-4">{token.marketCap}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {token.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 