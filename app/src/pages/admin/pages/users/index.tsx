import { type FC, useState } from "react";
import { IconSearch, IconUsers } from "@tabler/icons-react";
import { useGetAdminStats, useGetAdminUsers } from "@/features/admin/hooks/use-admin";
import { RoleTypes } from "@/features/user/interfaces/user.interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const roleBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
    [RoleTypes.SUPER_ADMIN]: "destructive",
    [RoleTypes.ADMIN]: "default",
    [RoleTypes.SUPPORT]: "secondary",
    [RoleTypes.USER]: "secondary",
};

const StatCard = ({ label, value, isLoading }: { label: string; value: string; isLoading: boolean }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription>{label}</CardDescription>
        </CardHeader>
        <CardContent>{isLoading ? <Skeleton className="h-7 w-20" /> : <CardTitle className="text-2xl">{value}</CardTitle>}</CardContent>
    </Card>
);

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);

const AdminUsersPage: FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const stats = useGetAdminStats();
    const users = useGetAdminUsers({ page, limit: 20, search: search || undefined });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                <p className="text-sm text-muted-foreground">Every account on the platform, and the usage behind it.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Users" value={(stats.data?.users_count ?? 0).toLocaleString()} isLoading={stats.isLoading} />
                <StatCard
                    label="Research projects"
                    value={(stats.data?.research_projects_count ?? 0).toLocaleString()}
                    isLoading={stats.isLoading}
                />
                <StatCard
                    label="Tokens this month"
                    value={(stats.data?.tokens_this_month ?? 0).toLocaleString()}
                    isLoading={stats.isLoading}
                />
                <StatCard
                    label="Estimated AI cost this month"
                    value={formatCurrency(stats.data?.estimated_cost_usd_this_month ?? 0)}
                    isLoading={stats.isLoading}
                />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle className="text-base">All users</CardTitle>
                            <CardDescription>{users.data?.pagination.total ?? 0} total</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                className="pl-8"
                                placeholder="Search by email or phone"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {users.isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : users.isError ? (
                        <p className="text-sm text-muted-foreground">
                            {users.error instanceof Error ? users.error.message : "Unable to load users."}
                        </p>
                    ) : !users.data?.data.length ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center">
                            <IconUsers className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No users match this search.</p>
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Projects</TableHead>
                                        <TableHead>Joined</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.data.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={roleBadgeVariant[user.role] ?? "secondary"}>{user.role}</Badge>
                                            </TableCell>
                                            <TableCell>{user.research_project_count}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Pagination
                                className="mt-4"
                                currentPage={users.data.pagination.page}
                                totalPages={users.data.pagination.total_pages}
                                onPageChange={setPage}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUsersPage;
