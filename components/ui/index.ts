// Barrel file – re-exports all UI primitives so consumers can do:
//   import { Button, Input, … } from '@/components/ui'

// ── Raw primitives ──
export { Button, buttonVariants } from './button'
export { Input } from './input'
export { PasswordInput } from './password-input'
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'
export { Label } from './label'
export { Checkbox } from './checkbox'
export { Textarea } from './textarea'
export { Badge } from './badge'
export { Card } from './card'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
export { Separator } from './separator'
export { Skeleton } from './skeleton'
export { Switch } from './switch'
export { Progress } from './progress'
export { Slider } from './slider'
export { Avatar, AvatarImage, AvatarFallback } from './avatar'
export { StarRating } from './star-rating'
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip'

// ── Enhanced form-friendly wrappers ──
export { FormInput } from './form-input'
export { FormSelect } from './form-select'
export { FormButton, formButtonVariants } from './form-button'
