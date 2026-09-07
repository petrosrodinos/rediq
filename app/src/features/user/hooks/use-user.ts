import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateMe } from "../services/user.services";
import type { UpdateUserDto } from "../interfaces/user.interface";
import { toast } from "@/hooks/use-toast";

export const useGetMe = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: () => getMe(),
    });
};

export const useUpdateMe = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: UpdateUserDto) => updateMe(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast({
                title: "Profile updated",
                description: "Your profile was updated successfully",
                duration: 2000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not update profile",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
};
