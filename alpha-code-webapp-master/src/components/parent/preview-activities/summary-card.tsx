import { Card, CardContent } from "@/components/ui/card"

interface SummaryCardProps {
  totalActions: number
  totalDuration: number
}

export function SummaryCard({ totalActions, totalDuration }: SummaryCardProps) {
  return (
    <Card className="border-0 bg-gray-50 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {totalActions}
            </div>
            <div className="text-sm text-gray-600">Tổng Số Hành Động</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {totalDuration.toFixed(1)}s
            </div>
            <div className="text-sm text-gray-600">Tổng Thời Lượng</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}