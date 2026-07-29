import { useEffect, useState } from "react";
import { GrowthChart, SourceDonut, AccountsTable, TasksList } from "./dashboard.ui";
import StatsCard from "@/components/common/StatsCards";
import { fetchDashboardData } from "./dashboard.data";
import type { Task, StatItem } from "./dashboard.data";
import { CreateAccountRequest, CreateLeadRequest } from "@/types/api.types";

export default function ManagerDashboardPage() {
  const [accounts, setAccounts] = useState<CreateAccountRequest[]>([]);
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [stats, setStats]       = useState<StatItem[]>([]);
  const [rawLeads, setRawLeads]       = useState<CreateLeadRequest[]>([]);  
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchDashboardData("MANAGER")
      .then(({ rawAccounts, tasks, stats , rawLeads }) => {
        setAccounts(rawAccounts);
        setTasks(tasks);
        setStats(stats);
        setRawLeads(rawLeads);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-[#94a3b8] p-6">Loading...</div>;

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {stats.map(stat => <StatsCard key={stat.label} {...stat} />)}
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <GrowthChart title="Account Growth" leads={rawLeads} />
                <SourceDonut title="Leads by Source" leads={rawLeads}/>
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <AccountsTable title="Recent Accounts" accounts={accounts} />
                <TasksList title="Upcoming Tasks" tasks={tasks} />
            </div>
        </div>
    );
}