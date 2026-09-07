import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { UpdateUserDto, User } from "../interfaces/user.interface";

export const getMe = async (): Promise<User> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.users.me);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch current user. Please try again.");
    }
};

export const updateMe = async (dto: UpdateUserDto): Promise<User> => {
    try {
        const response = await axiosInstance.patch(ApiRoutes.users.me, dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to update user. Please try again.");
    }
};
