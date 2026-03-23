import { PageHeader } from '@/components/common/PageHeader'

export default function PipelinePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipeline"
        description="Visual Kanban pipeline board"
      />
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm text-gray-400">PipelinePage — ready to build</p>
      </div>
    </div>
  )
}
