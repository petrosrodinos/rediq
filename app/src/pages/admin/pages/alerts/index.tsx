import { type FC, useState } from "react";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAdminQueueStatus, useGetAdminSystemErrors } from "@/features/admin/hooks/use-admin";
import { JobEventLevel, type JobEventLevelType } from "@/features/analysis-jobs/interfaces/analysis-jobs.interfaces";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const levelBadgeVariant: Record<JobEventLevelType, "destructive" | "secondary" | "default"> = {
    [JobEventLevel.ERROR]: "destructive",
    [JobEventLevel.WARNING]: "secondary",
    [JobEventLevel.INFO]: "default",
};

const levelFilters: { label: string; value: JobEventLevelType | undefined }[] = [
    { label: "Warnings & errors", value: undefined },
    { label: "Errors only", value: JobEventLevel.ERROR },
    { label: "Warnings only", value: JobEventLevel.WARNING },
];

const QueueStatusCard: FC = () => {
    const queue = useGetAdminQueueStatus();

    if (queue.isLoading) {
        return <Skeleton className="h-40 rounded-xl" />;
    }

    if (queue.isError || !queue.data) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Queue status</CardTitle>
                    <CardDescription>
                        {queue.error instanceof Error ? queue.error.message : "Unable to load queue status."}
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Analysis queue</CardTitle>
                <CardDescription className="font-mono text-xs">{queue.data.queue_name}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {Object.entries(queue.data.job_counts).map(([status, count]) => (
                    <div key={status} className="rounded-lg border p-3">
                        <div className="text-xs uppercase text-muted-foreground">{status}</div>
                        <div className="text-xl font-semibold tabular-nums">{count}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const AdminAlertsPage: FC = () => {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [level, setLevel] = useState<JobEventLevelType | undefined>(undefined);

    const errors = useGetAdminSystemErrors({ page, limit: 20, level });

    const refresh = () => {
        void queryClient.invalidateQueries({ queryKey: ["admin", "system-errors"] });
        void queryClient.invalidateQueries({ queryKey: ["admin", "queue"] });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
                    <p className="text-sm text-muted-foreground">Pipeline errors, warnings and queue health across every job.</p>
                </div>
                <Button variant="outline" onClick={refresh}>
                    <IconRefresh className="mr-2 h-4 w-4" />
                    Refresh
                </Button>
            </div>

            <QueueStatusCard />

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base">System errors</CardTitle>
                            <CardDescription>{errors.data?.pagination.total ?? 0} total</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {levelFilters.map((filter) => (
                                <Button
                                    key={filter.label}
                                    size="sm"
                                    variant={level === filter.value ? "default" : "outline"}
                                    onClick={() => {
                                        setLevel(filter.value);
                                        setPage(1);
                                    }}
                                >
                                    {filter.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {errors.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                        </div>
                    ) : errors.isError ? (
                        <p className="text-sm text-muted-foreground">
                            {errors.error instanceof Error ? errors.error.message : "Unable to load system errors."}
                        </p>
                    ) : !errors.data?.data.length ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                            <IconAlertTriangle className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Nothing to report. The pipeline has been quiet.</p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y">
                                {errors.data.data.map((event) => (
                                    <div key={event.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant={levelBadgeVariant[event.level]}>{event.level}</Badge>
                                            <span className="text-sm font-medium">{event.step}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(event.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className={cn("text-sm text-muted-foreground")}>{event.message}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {event.analysis_job.research_project.name} · {event.analysis_job.research_project.user.email}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                className="mt-4"
                                currentPage={errors.data.pagination.page}
                                totalPages={errors.data.pagination.total_pages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminAlertsPage;
