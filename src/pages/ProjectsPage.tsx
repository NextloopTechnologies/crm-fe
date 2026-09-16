import { PageHeader } from '@/components/common/PageHeader'

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Client projects and milestones"
      />
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm text-gray-400">ProjectsPage — ready to build</p>
      </div>
    </div>
  )
}
