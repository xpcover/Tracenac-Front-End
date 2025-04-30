import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const forexRateSchema = z.object({
  currency_code: z.string().min(3, 'Currency code must be 3 characters').max(3),
  date: z.string().min(1, 'Date is required'),
  exchange_rate: z.number().min(0, 'Exchange rate must be positive'),
})

type ForexRateFormData = z.infer<typeof forexRateSchema>

interface ForexRateFormProps {
  rate?: {
    currency_code: string
    date: string
    exchange_rate: number
  } | null
  onSubmit: (data: ForexRateFormData) => void
}

const COMMON_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'INR',
]

export default function ForexRateForm({ rate, onSubmit }: ForexRateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForexRateFormData>({
    resolver: zodResolver(forexRateSchema),
    defaultValues: {
      currency_code: rate?.currency_code || '',
      date: rate?.date || new Date().toISOString().split('T')[0],
      exchange_rate: rate?.exchange_rate || 1,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Currency Code
        </label>
        <select
          {...register('currency_code')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select currency</option>
          {COMMON_CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
        {errors.currency_code && (
          <p className="mt-1 text-sm text-red-600">
            {errors.currency_code.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <Input type="date" {...register('date')} className="mt-1" />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Exchange Rate
        </label>
        <Input
          type="number"
          step="0.0001"
          {...register('exchange_rate', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.exchange_rate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.exchange_rate.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Rate</Button>
      </div>
    </form>
  )
}