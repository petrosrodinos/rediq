import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { searchResearchProject } from "../services/search.services";
import type { SearchDto } from "../interfaces/search.interfaces";

// Search-as-you-act, triggered by user input/submit rather than auto-fetched,
// so it's modeled as a mutation. No success toast (a toast on every search
// result would be noisy) but errors still surface feedback per the rules.
export const useSearchResearchProject = () => {
    return useMutation({
        mutationFn: ({ researchProjectId, dto }: { researchProjectId: string; dto: SearchDto }) =>
            searchResearchProject(researchProjectId, dto),
        onError: (error: any) => {
            toast({
                title: "Could not search research project",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};
