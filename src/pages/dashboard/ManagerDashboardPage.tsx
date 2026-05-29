import { GrowthChart, SourceDonut, AccountsTable, TasksList } from "./dashboard.ui";
import StatsCard from "@/components/common/StatsCards";
import { MANAGER_STATS } from "./dashboard.data";

export default function ManagerDashboardPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {MANAGER_STATS.map(stat => <StatsCard key={stat.label} {...stat} />)}
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <GrowthChart title="Account Growth" />
                <SourceDonut title="Accounts by Source" />
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <AccountsTable title="Recent Accounts" />
                <TasksList title="Upcoming Tasks" />
            </div>
        </div>
    );
}