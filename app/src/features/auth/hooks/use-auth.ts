import { adminLoginToAccount, forgotPassword, refreshAccountToken, resetPassword, signIn, signUp, waitlist } from "../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "react-router-dom";
import type { ForgotPasswordDto, ResetPasswordDto, SignInUser, SignUpUser, WaitlistDto } from "../interfaces/auth.interface";
import { Routes } from "@/routes/routes";
import type { LoggedInUser } from "@/features/user/interfaces/user.interface";
import { toast } from "@/hooks/use-toast";


export function useSignin() {
    const { login } = useAuthStore((state) => state);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: SignInUser) => signIn(data),
        onSuccess: (data: LoggedInUser) => {
            login({
                ...data,
                isLoggedIn: true,
            });
            toast({
                title: "Login successful",
                description: "You have successfully logged in",
                duration: 2000,
            });
            navigate(Routes.dashboard);
        },
        onError: (error: any) => {
            toast({
                title: "Could not sign in",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
}


export function useSignup() {
    const { login } = useAuthStore((state) => state);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: SignUpUser) => signUp(data),
        onSuccess: (data) => {
            login({
                ...data,
                isLoggedIn: true,
            });
            toast({
                title: "Register successful",
                description: "You have successfully registered in",
                duration: 2000,
            });
            navigate("/dashboard");
        },
        onError: (error) => {
            toast({
                title: "Could not sign up",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
}


export function useRefreshAccountToken() {
    const { login } = useAuthStore((state) => state);
    return useMutation({
        mutationFn: () => refreshAccountToken(),
        onSuccess: (data: LoggedInUser) => {
            login({ ...data, isLoggedIn: true });
        },
    });
}

export function useAdminLoginToAccount() {
    const { login } = useAuthStore((state) => state);

    return useMutation({
        mutationFn: (account_uuid: string) => adminLoginToAccount(account_uuid),
        onSuccess: (data: LoggedInUser) => {
            toast({
                title: "Admin login successful",
                description: "You have successfully logged in as admin",
                duration: 2000,
            });
            login({
                ...data,
                isLoggedIn: true,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not admin login to account",
                description: error.message,
                duration: 3000,
                variant: "error",
            });
        },
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: (data: ForgotPasswordDto) => forgotPassword(data),
        onSuccess: (data) => {
            toast({
                title: "Reset email sent",
                description: data.message,
                duration: 3000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not send reset email",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
}

export function useResetPassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: ResetPasswordDto) => resetPassword(data),
        onSuccess: (data) => {
            toast({
                title: "Password reset",
                description: data.message,
                duration: 3000,
            });
            navigate(Routes.auth.sign_in);
        },
        onError: (error: any) => {
            toast({
                title: "Could not reset password",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
}

export function useWaitlist() {
    return useMutation({
        mutationFn: (data: WaitlistDto) => waitlist(data),
        onSuccess: (data) => {
            toast({
                title: "You're on the waitlist",
                description: data.message,
                duration: 3000,
            });
        },
        onError: (error: any) => {
            toast({
                title: "Could not join the waitlist",
                description: error?.message || "An unexpected error occurred",
                duration: 3000,
                variant: "error",
            });
        },
    });
}