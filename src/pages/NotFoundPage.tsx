import { PageHeader } from '@/components/common/PageHeader'

export default function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="404 - Not Found"
        description="The page you are looking for does not exist"
      />
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm text-gray-400">NotFoundPage — ready to build</p>
      </div>
    </div>
  )
}
