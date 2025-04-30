import { Play } from 'lucide-react'
import Button from '../ui/Button'
import { startWalkthrough } from '@/lib/walkthrough'

interface WalkthroughButtonProps {
  type: 'main' | 'assetManagement' | 'reports'
  className?: string
}

export function WalkthroughButton({ type, className }: WalkthroughButtonProps) {
  return (
    <Button
      variant="secondary"
      onClick={() => startWalkthrough(type)}
      className={className}
    >
      <Play className="w-4 h-4 mr-2" />
      Start Tour
    </Button>
  )
}