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
  ArrowLeftIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  WalletIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function CreatorVerification() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Wallet connection hooks
  const { isConnected, isConnecting } = useAccount()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          router.push('/login')
          return
        }
        
        setUser(user)
        
        // Check if user already has account proof
        const { data: accountProof } = await supabase
          .from('account_proofs')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (accountProof && accountProof.nft_address) {
          // User is already verified, redirect to creator dashboard
          router.push('/creator')
          return
        }
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

  const handleVerifyAccount = () => {
    if (!isConnected) {
      alert('Please connect your wallet first to start the verification process.')
      return
    }
    // Redirect to vlayer project frontend
    window.location.href = 'http://localhost:5173'
  }

  if (loading || isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Show wallet connection prompt if wallet is not connected
  if (!isConnected) {
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
                <Link href="/creator/verify" className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">Creator Verification</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <WalletConnect />
                
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
                      Back to Dashboard
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
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <div className="w-full max-w-2xl">
            <Card className="relative overflow-hidden border-2 border-orange-200 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5" />
              <CardHeader className="relative text-center pb-6">
                <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-10 h-10 text-orange-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                  Wallet Connection Required
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  You need to connect your wallet to start the account verification process. Your wallet is required to mint the creator NFT upon successful verification.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative space-y-6">
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardHeader className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
                      <WalletIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">Connect Your Wallet</CardTitle>
                    <CardDescription>
                      Connect your Web3 wallet to proceed with creator verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <WalletConnect 
                      variant="gradient" 
                      className="w-full justify-center py-3 text-lg"
                    />
                    <p className="text-sm text-gray-500 text-center">
                      Your wallet will be used to mint your creator NFT after successful verification
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Why is a wallet required?</h3>
                  <div className="grid gap-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Mint your unique creator NFT credential</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Interact with smart contracts for verification</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Manage your future creator tokens</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard')}
                    className="w-full"
                    size="lg"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
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
              <Link href="/creator/verify" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-bold text-gray-900">Creator Verification</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
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
                    Back to Dashboard
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

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-2xl">
          <Card className="relative overflow-hidden border-2 border-purple-200 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <CardHeader className="relative text-center pb-6">
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Account Verification Required
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                To access Creator Mode, you need to verify your social media account ownership using zkTLS proofs. This ensures authentic creator credentials while maintaining your privacy.
                {isConnected && (
                  <span className="block mt-2 text-green-600 font-medium">
                    ✓ Wallet connected - Ready to proceed with verification
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative space-y-8">
              {/* Benefits Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">What you'll get:</h3>
                <div className="grid gap-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Cryptographic Account Proof</p>
                      <p className="text-sm text-gray-600">Zero-knowledge verification of your social media account ownership</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Creator NFT Credential</p>
                      <p className="text-sm text-gray-600">Mint a unique NFT that proves your verified creator status</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Token Launching Access</p>
                      <p className="text-sm text-gray-600">Unlock the ability to create and manage your own tokens</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircleIcon className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Privacy Preserved</p>
                      <p className="text-sm text-gray-600">Your sensitive data never leaves your browser during verification</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How it Works Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">How it works:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">1</div>
                    <p className="text-gray-700">Connect to your social media account</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">2</div>
                    <p className="text-gray-700">Generate zkTLS proof of account ownership</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">3</div>
                    <p className="text-gray-700">Verify proof on-chain and mint your creator NFT</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">4</div>
                    <p className="text-gray-700">Access your creator dashboard and start launching tokens</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <Button 
                  onClick={handleVerifyAccount}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 text-lg"
                  size="lg"
                >
                  Start Verification Process
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                  size="lg"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 