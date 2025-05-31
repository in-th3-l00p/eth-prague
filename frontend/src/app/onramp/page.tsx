'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { WalletConnect } from '@/components/WalletConnect'
import { 
  ArrowLeftIcon,
  ArrowsUpDownIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

// Available influencer tokens for purchase
const availableTokens = [
  {
    id: 1,
    symbol: 'ALEX',
    name: 'Alex Chen Token',
    price: 0.45,
    creator: 'Alex Chen',
    avatar: 'AC',
    verified: true
  },
  {
    id: 2,
    symbol: 'SARAH',
    name: 'Sarah Martinez Token', 
    price: 0.32,
    creator: 'Sarah Martinez',
    avatar: 'SM',
    verified: true
  },
  {
    id: 3,
    symbol: 'MIKE',
    name: 'Mike Johnson Token',
    price: 0.18,
    creator: 'Mike Johnson',
    avatar: 'MJ',
    verified: false
  },
  {
    id: 4,
    symbol: 'EMMA',
    name: 'Emma Wilson Token',
    price: 0.67,
    creator: 'Emma Wilson',
    avatar: 'EW',
    verified: true
  },
  {
    id: 5,
    symbol: 'DAVID',
    name: 'David Kim Token',
    price: 0.89,
    creator: 'David Kim',
    avatar: 'DK',
    verified: true
  }
]

type SwapStatus = 'idle' | 'pending_payment' | 'pending_proof' | 'verifying' | 'completed' | 'failed'

export default function OnRampPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [eurAmount, setEurAmount] = useState('')
  const [selectedToken, setSelectedToken] = useState<typeof availableTokens[0] | null>(null)
  const [tokenAmount, setTokenAmount] = useState('')
  const [swapStatus, setSwapStatus] = useState<SwapStatus>('idle')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [transactionId, setTransactionId] = useState('')
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

  // Calculate token amount based on EUR input and selected token price
  useEffect(() => {
    if (eurAmount && selectedToken) {
      const tokens = parseFloat(eurAmount) / selectedToken.price
      setTokenAmount(tokens.toFixed(6))
    } else {
      setTokenAmount('')
    }
  }, [eurAmount, selectedToken])

  const handleInitiateSwap = () => {
    if (!eurAmount || !selectedToken) return
    setSwapStatus('pending_payment')
  }

  const handlePaymentMade = () => {
    setSwapStatus('pending_proof')
  }

  const handleProofUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProofFile(file)
    }
  }

  const handleSubmitProof = async () => {
    if (!proofFile || !transactionId) return
    
    setSwapStatus('verifying')
    
    try {
      // Simulate zkTLS proof verification
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Here you would implement the actual zkTLS proof verification
      // and token minting/transfer logic
      console.log('Verifying zkTLS proof for transaction:', transactionId)
      console.log('Proof file:', proofFile.name)
      
      setSwapStatus('completed')
    } catch (error) {
      console.error('Proof verification failed:', error)
      setSwapStatus('failed')
    }
  }

  const resetSwap = () => {
    setSwapStatus('idle')
    setEurAmount('')
    setTokenAmount('')
    setProofFile(null)
    setTransactionId('')
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
                onClick={() => router.push('/fan')}
                className="mr-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <Link href="/onramp" className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">€</span>
                </div>
                <span className="text-lg font-bold text-gray-900">Euro On-Ramp</span>
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
                  <DropdownMenuItem onClick={() => router.push('/fan')}>
                    Back to Fan Mode
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

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Buy Creator Tokens with Euros
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Purchase influencer tokens directly with your Revolut account. No crypto wallet required to get started.
          </p>
        </div>

        {/* Swap Interface */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center">Euro to Token Swap</CardTitle>
            <CardDescription className="text-center">
              Powered by zkTLS proofs from Revolut
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {swapStatus === 'idle' && (
              <>
                {/* From (EUR) */}
                <div className="space-y-2">
                  <Label htmlFor="eur-amount">From</Label>
                  <div className="relative">
                    <Input
                      id="eur-amount"
                      type="number"
                      placeholder="0.00"
                      value={eurAmount}
                      onChange={(e) => setEurAmount(e.target.value)}
                      className="text-2xl h-16 pr-20 text-right"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <span className="text-lg font-medium">EUR</span>
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-bold">€</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Swap Arrow */}
                <div className="flex justify-center">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <ArrowsUpDownIcon className="w-5 h-5 text-gray-600" />
                  </div>
                </div>

                {/* To (Token) */}
                <div className="space-y-2">
                  <Label htmlFor="token-select">To</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select onValueChange={(value: string) => {
                      const token = availableTokens.find(t => t.symbol === value)
                      setSelectedToken(token || null)
                    }}>
                      <SelectTrigger className="h-16">
                        <SelectValue placeholder="Select token">
                          {selectedToken && (
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-700">{selectedToken.avatar}</span>
                              </div>
                              <div className="text-left">
                                <div className="font-medium">{selectedToken.symbol}</div>
                                <div className="text-sm text-gray-500">{selectedToken.creator}</div>
                              </div>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTokens.map((token) => (
                          <SelectItem key={token.id} value={token.symbol}>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-700">{token.avatar}</span>
                              </div>
                              <div>
                                <div className="font-medium">{token.symbol}</div>
                                <div className="text-sm text-gray-500">{token.creator}</div>
                              </div>
                              <div className="ml-auto text-sm text-gray-600">
                                €{token.price}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="0.000000"
                        value={tokenAmount}
                        readOnly
                        className="text-2xl h-16 text-right bg-gray-50"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-lg font-medium text-gray-600">
                          {selectedToken?.symbol || 'TOKEN'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                {selectedToken && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Rate</span>
                      <span className="font-medium">1 {selectedToken.symbol} = €{selectedToken.price}</span>
                    </div>
                  </div>
                )}

                {/* Swap Button */}
                <Button
                  onClick={handleInitiateSwap}
                  disabled={!eurAmount || !selectedToken || parseFloat(eurAmount) <= 0}
                  className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Initiate Swap
                </Button>
              </>
            )}

            {/* Payment Instructions */}
            {swapStatus === 'pending_payment' && (
              <div className="space-y-6">
                <div className="text-center">
                  <ClockIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Make Payment via Revolut</h3>
                  <p className="text-gray-600">
                    Please send €{eurAmount} to the following Revolut account to complete your swap for {tokenAmount} {selectedToken?.symbol} tokens.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Revolut Username</Label>
                    <div className="bg-white p-3 rounded border font-mono text-center">
                      @propellant-onramp
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Amount</Label>
                    <div className="bg-white p-3 rounded border font-mono text-center text-lg font-bold">
                      €{eurAmount}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Reference (Important!)</Label>
                    <div className="bg-white p-3 rounded border font-mono text-center">
                      SWAP-{Date.now().toString().slice(-6)}
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Important:</p>
                    <p>Make sure to include the reference exactly as shown above. This helps us match your payment to your swap request.</p>
                  </div>
                </div>

                <Button
                  onClick={handlePaymentMade}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
                >
                  I've Made the Payment
                </Button>
              </div>
            )}

            {/* Proof Upload */}
            {swapStatus === 'pending_proof' && (
              <div className="space-y-6">
                <div className="text-center">
                  <InformationCircleIcon className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Transaction Proof</h3>
                  <p className="text-gray-600">
                    Please provide your Revolut transaction ID and upload the zkTLS proof to verify your payment.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="transaction-id">Revolut Transaction ID</Label>
                    <Input
                      id="transaction-id"
                      placeholder="Enter your transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="proof-file">zkTLS Proof File</Label>
                    <Input
                      id="proof-file"
                      type="file"
                      accept=".json,.txt,.proof"
                      onChange={handleProofUpload}
                    />
                    {proofFile && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ File uploaded: {proofFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h4 className="font-medium mb-2">How to generate zkTLS proof:</h4>
                  <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Open your Revolut app or web browser</li>
                    <li>Navigate to your transaction history</li>
                    <li>Find the payment you just made</li>
                    <li>Use the zkTLS proof generator extension</li>
                    <li>Download the generated proof file</li>
                  </ol>
                </div>

                <Button
                  onClick={handleSubmitProof}
                  disabled={!proofFile || !transactionId}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Verify Proof & Complete Swap
                </Button>
              </div>
            )}

            {/* Verifying */}
            {swapStatus === 'verifying' && (
              <div className="space-y-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Verifying Proof</h3>
                  <p className="text-gray-600">
                    We're verifying your zkTLS proof and processing your token swap. This may take a few moments.
                  </p>
                </div>
              </div>
            )}

            {/* Completed */}
            {swapStatus === 'completed' && (
              <div className="space-y-6 text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-600">Swap Completed!</h3>
                  <p className="text-gray-600 mb-4">
                    Congratulations! You've successfully swapped €{eurAmount} for {tokenAmount} {selectedToken?.symbol} tokens.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      Your tokens have been sent to your connected wallet or can be claimed using the transaction reference.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/fan')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Back to Fan Dashboard
                  </Button>
                  <Button
                    onClick={resetSwap}
                    variant="outline"
                    className="w-full"
                  >
                    Make Another Swap
                  </Button>
                </div>
              </div>
            )}

            {/* Failed */}
            {swapStatus === 'failed' && (
              <div className="space-y-6 text-center">
                <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-red-600">Verification Failed</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't verify your transaction proof. Please check your transaction ID and proof file.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => setSwapStatus('pending_proof')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={resetSwap}
                    variant="outline"
                    className="w-full"
                  >
                    Start New Swap
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 space-y-4">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <InformationCircleIcon className="w-5 h-5 text-purple-600 mr-2" />
                How it works
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>1. <strong>Choose your swap:</strong> Select the token and amount you want to purchase</p>
                <p>2. <strong>Make payment:</strong> Send EUR via Revolut to our secure account</p>
                <p>3. <strong>Generate proof:</strong> Create a zkTLS proof of your Revolut transaction</p>
                <p>4. <strong>Receive tokens:</strong> Your tokens are minted and transferred automatically</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p>• <strong>No wallet required</strong> to get started</p>
                  <p>• <strong>Direct EUR payments</strong> via Revolut</p>
                </div>
                <div>
                  <p>• <strong>Zero-knowledge privacy</strong> with zkTLS</p>
                  <p>• <strong>Instant verification</strong> and token delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 