import { getQuoteForDate } from '../../data/quotes'
import { Card } from '../common/Card'

export function QuoteOfDay() {
  const quote = getQuoteForDate(new Date())
  return (
    <Card className="text-center bg-gradient-to-br from-gold-50 to-lotus-50">
      <p className="font-display text-xl sm:text-2xl text-ink-700 leading-snug italic">
        “{quote.text}”
      </p>
      {quote.source && <p className="mt-3 text-sm text-gold-500 font-medium">— {quote.source}</p>}
    </Card>
  )
}
