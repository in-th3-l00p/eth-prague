'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { WalletIcon } from '@heroicons/react/24/outline'

interface WalletConnectProps {
  variant?: 'default' | 'gradient'
  showBalance?: boolean
  className?: string
}

export function WalletConnect({ 
  variant = 'default', 
  showBalance = false,
  className = '' 
}: WalletConnectProps) {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address: address,
  })

  const handleConnectWallet = () => {
    const metamaskConnector = connectors.find(connector => connector.name === 'MetaMask')
    if (metamaskConnector) {
      connect({ connector: metamaskConnector })
    }
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex items-center space-x-2 ${className}`}
          >
            <WalletIcon className="h-4 w-4" />
            <span className="hidden sm:inline">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            {showBalance && balance && (
              <span className="text-sm text-gray-600 hidden md:inline">
                {parseFloat(formatEther(balance.value)).toFixed(4)} ETH
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="px-2 py-1.5 text-sm text-gray-600">
            <div className="font-medium">Connected Wallet</div>
            <div className="text-xs truncate">{address}</div>
            {showBalance && balance && (
              <div className="text-xs">
                Balance: {parseFloat(formatEther(balance.value)).toFixed(4)} ETH
              </div>
            )}
          </div>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(address)}>
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => disconnect()}>
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button 
      onClick={handleConnectWallet}
      disabled={isConnecting || isPending}
      className={`flex items-center space-x-2 ${
        variant === 'gradient' 
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
          : ''
      } ${className}`}
    >
      <WalletIcon className="h-4 w-4" />
      <span>{isConnecting || isPending ? 'Connecting...' : 'Connect Wallet'}</span>
    </Button>
  )
}