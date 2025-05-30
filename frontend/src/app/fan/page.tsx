'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  StarIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const portfolioStats = [
  { name: 'Portfolio Value', value: '$8,432.50', change: '+12.3%', changeType: 'positive' },
  { name: 'Total Tokens', value: '12', change: '+3', changeType: 'positive' },
  { name: 'Best Performer', value: '+45.2%', change: 'CREATOR', changeType: 'positive' },
  { name: 'Total Invested', value: '$6,250.00', change: '+$1,200', changeType: 'positive' },
]

const myTokens = [
  {
    id: 1,
    name: 'CREATOR',
    symbol: 'CRT',
    creator: '@johndoe',
    price: '$0.45',
    change: '+12.5%',
    owned: 1000,
    value: '$450.00',
    status: 'Holding'
  },
  {
    id: 2,
    name: 'CONTENT',
    symbol: 'CNT',
    creator: '@janedoe',
    price: '$0.32',
    change: '+8.7%',
    owned: 500,
    value: '$160.00',
    status: 'Holding'
  },
  {
    id: 3,
    name: 'FANBASE',
    symbol: 'FAN',
    creator: '@creator123',
    price: '$0.18',
    change: '-2.1%',
    owned: 2000,
    value: '$360.00',
    status: 'Holding'
  }
]

const trendingTokens = [
  {
    id: 1,
    name: 'VIRAL',
    symbol: 'VRL',
    creator: '@viralcreator',
    price: '$0.67',
    change: '+25.4%',
    marketCap: '$125,430',
    holders: 2341
  },
  {
    id: 2,
    name: 'STREAM',
    symbol: 'STM',
    creator: '@streamer',
    price: '$0.89',
    change: '+18.9%',
    marketCap: '$89,234',
    holders: 1876
  },
  {
    id: 3,
    name: 'MUSIC',
    symbol: 'MSC',
    creator: '@musician',
    price: '$1.23',
    change: '+15.2%',
    marketCap: '$234,567',
    holders: 3421
  }
]

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function FanDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
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
              <Link href="/fan" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-bold text-gray-900">Fan Mode</span>
              </Link>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-m-1.5 p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="size-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
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
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fan Dashboard</h1>
              <p className="mt-2 text-gray-600">Discover and invest in creator tokens</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Explore Tokens
            </Button>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {portfolioStats.map((stat) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Portfolio */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Portfolio</CardTitle>
                  <CardDescription>Your token holdings</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{token.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{token.name}</div>
                        <div className="text-sm text-gray-500">{token.creator}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{token.value}</div>
                      <div className={classNames(
                        token.change.startsWith('+') ? 'text-green-600' : 'text-red-600',
                        'text-sm font-medium'
                      )}>
                        {token.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Tokens */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Trending Tokens</CardTitle>
                  <CardDescription>Hot tokens to watch</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingTokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{token.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{token.name}</div>
                        <div className="text-sm text-gray-500">{token.creator}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{token.price}</div>
                      <div className="text-green-600 text-sm font-medium">{token.change}</div>
                    </div>
                    <Button size="sm" variant="outline">
                      <HeartIcon className="w-4 h-4 mr-1" />
                      Buy
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Discover Tokens</CardTitle>
                  <CardDescription>Find new creator tokens to invest in</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Portfolio Analytics</CardTitle>
                  <CardDescription>Track your investment performance</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <StarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Watchlist</CardTitle>
                  <CardDescription>Monitor your favorite creators</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  )
} 