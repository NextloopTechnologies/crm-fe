import { PageHeader } from '@/components/common/PageHeader'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your pipeline, tasks, and team activity"
      />
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm text-gray-400">DashboardPage — ready to build</p>
      </div>
    </div>
  )
}
