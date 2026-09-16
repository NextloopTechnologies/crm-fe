import { PageHeader } from '@/components/common/PageHeader'

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Tasks"
        description="Your tasks and follow-ups"
      />
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm text-gray-400">TasksPage — ready to build</p>
      </div>
    </div>
  )
}
