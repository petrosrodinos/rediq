import { formatAuthUser } from "../utils/auth.utils";
import axiosInstance from "@/config/api/axios";
import type { ForgotPasswordDto, ResetPasswordDto, SignInUser, SignUpUser, WaitlistDto } from "../interfaces/auth.interface";
import { ApiRoutes } from "@/config/api/routes";
import type { LoggedInUser } from "@/features/user/interfaces/user.interface";

export const signIn = async (
    { email, password }: SignInUser,
): Promise<LoggedInUser> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.email.login, {
            email,
            password,
        });

        const auth_response = response.data;
        return formatAuthUser(auth_response);

    } catch (error) {
        throw new Error("Failed to sign in. Please try again.");
    }
};

export const signUp = async ({ email, password }: SignUpUser): Promise<LoggedInUser> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.email.register, {
            email,
            password,
        });

        const auth_response = response.data;
        return formatAuthUser(auth_response);
    } catch (error) {
        throw new Error("Failed to sign up. Please try again.");
    }
};

export const refreshAccountToken = async (): Promise<LoggedInUser> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.email.refresh_token);
        return formatAuthUser(response.data);
    } catch (error: any) {
        throw new Error(error.response.data.message || "Failed to refresh account token. Please try again.");
    }
};

export const adminLoginToAccount = async (account_uuid: string): Promise<LoggedInUser> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.email.admin_login_to_account(account_uuid));
        return formatAuthUser(response.data);
    } catch (error: any) {
        throw new Error(error.response.data.message || "Failed to admin login to account. Please try again.");
    }
};

export const forgotPassword = async (dto: ForgotPasswordDto): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.email.forgot_password, dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to send password reset email. Please try again.");
    }
};

export const resetPassword = async (dto: ResetPasswordDto): Promise<{ message: string }> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.email.reset_password, dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to reset password. Please try again.");
    }
};

export const waitlist = async (dto: WaitlistDto): Promise<{ message: string; code: string }> => {
    try {
        const response = await axiosInstance.post(ApiRoutes.auth.email.waitlist, dto);
        return response.data;
    } catch (error) {
        throw new Error("Failed to join the waitlist. Please try again.");
    }
};

