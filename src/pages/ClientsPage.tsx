import { PageHeader } from '@/components/common/PageHeader'

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="All active and past clients"
      />
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
        <p className="text-sm text-gray-400">ClientsPage — ready to build</p>
      </div>
    </div>
  )
}
