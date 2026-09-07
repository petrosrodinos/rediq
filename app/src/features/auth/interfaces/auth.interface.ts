
export interface SignInUser {
    email: string;
    password: string;
}

export interface SignUpUser {
    email: string;
    password: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    password: string;
}

export interface WaitlistDto {
    email: string;
}

