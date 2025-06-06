'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { WalletConnect } from '@/components/WalletConnect'
import { 
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  PlusIcon,
  FunnelIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  EyeIcon,
  ChartBarIcon,
  UserPlusIcon,
  WalletIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useAccount } from 'wagmi'

const influencerFeed = [
  {
    id: 1,
    name: 'Alex Chen',
    handle: '@alexchen',
    avatar: 'AC',
    verified: true,
    followers: '2.4M',
    tokenSymbol: 'ALEX',
    tokenPrice: '$0.45',
    tokenChange: '+12.5%',
    marketCap: '$89,234',
    holders: 1876,
    post: {
      content: "Just dropped my new course on Web3 development! 🚀 My token holders get 50% off. This is the future of creator economy!",
      image: null,
      timestamp: '2h',
      likes: 1234,
      comments: 89,
      shares: 156,
      views: 12500
    },
    isFollowing: false,
    hasToken: true
  },
  {
    id: 2,
    name: 'Sarah Martinez',
    handle: '@sarahcodes',
    avatar: 'SM',
    verified: true,
    followers: '890K',
    tokenSymbol: 'SARAH',
    tokenPrice: '$0.32',
    tokenChange: '+8.7%',
    marketCap: '$45,123',
    holders: 1234,
    post: {
      image: null,
      timestamp: '4h',
      likes: 2341,
      comments: 234,
      shares: 445,
      views: 23400
    },
    isFollowing: true,
    hasToken: false
  },
  {
    id: 3,
    name: 'Mike Johnson',
    handle: '@mikej_crypto',
    avatar: 'MJ',
    verified: false,
    followers: '156K',
    tokenSymbol: 'MIKE',
    tokenPrice: '$0.18',
    tokenChange: '-2.1%',
    marketCap: '$67,890',
    holders: 2341,
    post: {
      content: "Market analysis: Why I think we're entering a new bull cycle. My token holders get my premium research reports for free 📊",
      image: null,
      timestamp: '6h',
      likes: 567,
      comments: 123,
      shares: 89,
      views: 8900
    },
    isFollowing: false,
    hasToken: false
  },
  {
    id: 4,
    name: 'Emma Wilson',
    handle: '@emmawilson',
    avatar: 'EW',
    verified: true,
    followers: '3.2M',
    tokenSymbol: 'EMMA',
    tokenPrice: '$0.67',
    change: '+25.4%',
    marketCap: '$125,430',
    holders: 3421,
    post: {
      content: "Launching my NFT collection next week! 🎨 Token holders get whitelist access and 30% discount. Art meets DeFi!",
      image: null,
      timestamp: '8h',
      likes: 4567,
      comments: 678,
      shares: 890,
      views: 45600
    },
    isFollowing: true,
    hasToken: true
  },
  {
    id: 5,
    name: 'David Kim',
    handle: '@davidkim_tech',
    avatar: 'DK',
    verified: true,
    followers: '1.8M',
    tokenSymbol: 'DAVID',
    tokenPrice: '$0.89',
    tokenChange: '+18.9%',
    marketCap: '$234,567',
    holders: 1987,
    post: {
      content: "Just closed Series A for my startup! 🎉 My early token supporters are getting equity conversion options. This is how we build together!",
      image: null,
      timestamp: '12h',
      likes: 8901,
      comments: 1234,
      shares: 2345,
      views: 89000
    },
    isFollowing: false,
    hasToken: false
  }
]

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function FanDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [purchasingToken, setPurchasingToken] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Wallet connection hooks
  const { isConnected } = useAccount()

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

  const handleTokenPurchase = async (influencerId: number, tokenSymbol: string) => {
    if (!isConnected) {
      return
    }

    setPurchasingToken(influencerId)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log(`Purchasing ${tokenSymbol} token for influencer ${influencerId}`)

      alert(`Successfully purchased ${tokenSymbol} token!`)
      
    } catch (error) {
      console.error('Token purchase failed:', error)
      alert('Token purchase failed. Please try again.')
    } finally {
      setPurchasingToken(null)
    }
  }

  const toggleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
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
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-bold text-gray-900">Fan Mode</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Wallet Connection */}
              <WalletConnect variant="gradient" showBalance={true} />

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

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
              <p className="mt-2 text-gray-600">
                Explore and invest in creator tokens
                {!isConnected && (
                  <span className="block text-sm text-orange-600 mt-1">
                    Connect your wallet to purchase tokens
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Operation Buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ChartBarIcon className="w-4 h-4 mr-2" />
              Trending
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              Explore
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 px-4 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => router.push('/onramp')}
              className="h-9 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <span className="mr-2">€</span>
              Buy with EUR
            </Button>
            
            <Button 
              className="h-9 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              Your Tokens
            </Button>
          </div>
        </div>

        {/* Social Feed */}
        <div className="space-y-6">
          {influencerFeed.map((influencer) => (
            <div key={influencer.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Post Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                      <span className="text-lg font-medium text-purple-700">{influencer.avatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-black">{influencer.name}</h3>
                        {influencer.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{influencer.handle}</span>
                        <span>•</span>
                        <span>{influencer.followers} followers</span>
                        <span>•</span>
                        <span>{influencer.post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant={influencer.isFollowing ? "outline" : "default"}
                    size="sm"
                    className={classNames(
                      "h-8 px-3",
                      influencer.isFollowing 
                        ? "border-gray-300 text-gray-700 hover:bg-gray-50" 
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    )}
                  >
                    <UserPlusIcon className="w-4 h-4 mr-1" />
                    {influencer.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-4">
                <p className="text-gray-900 mb-4">{influencer.post.content}</p>
                
                {/* Token Info Card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">{influencer.tokenSymbol.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-black">${influencer.tokenSymbol}</span>
                          <span className="text-sm text-gray-600">{influencer.tokenPrice}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{influencer.holders} holders</span>
                          <span>MC: {influencer.marketCap}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={classNames(
                        "text-sm font-medium",
                        influencer.tokenChange?.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      )}>
                        {influencer.tokenChange}
                      </span>
                      <Button 
                        size="sm" 
                        onClick={() => !influencer.hasToken && handleTokenPurchase(influencer.id, influencer.tokenSymbol)}
                        disabled={purchasingToken === influencer.id}
                        className={classNames(
                          "h-8 px-3",
                          influencer.hasToken 
                            ? "bg-green-600 text-white hover:bg-green-700" 
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        )}
                      >
                        {purchasingToken === influencer.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent mr-2"></div>
                            Buying...
                          </>
                        ) : influencer.hasToken ? (
                          'Holding'
                        ) : !isConnected ? (
                          <>
                            <WalletIcon className="w-3 h-3 mr-1" />
                            Connect to Buy
                          </>
                        ) : (
                          'Buy'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Post Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{influencer.post.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{influencer.post.likes.toLocaleString()} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{influencer.post.comments} comments</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{influencer.post.shares} shares</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(influencer.id)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
                    >
                      {likedPosts.has(influencer.id) ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                      <span>Like</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span>Comment</span>
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 text-gray-600 hover:text-green-500">
                      <ShareIcon className="w-5 h-5" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="px-8 border-purple-200 text-purple-700 hover:bg-purple-50">
            Load More Posts
          </Button>
        </div>
      </main>
    </div>
  )
} 