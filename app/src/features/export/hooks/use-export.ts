import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { exportResearchProject } from "../services/export.services";
import type { ExportQueryType } from "../interfaces/export.interfaces";

// Modeled as a mutation (despite the underlying GET) since it's triggered
// on-demand by a "download/export" action rather than reactive list/detail data.
export const useExportResearchProject = () => {
    return useMutation({
        mutationFn: ({ researchProjectId, query }: { researchProjectId: string; query?: ExportQueryType }) =>
            exportResearchProject(researchProjectId, query),
        onSuccess: () => {
            toast({
                title: "Export ready",
                description: "Your research project export has been generated",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not export research project",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};
