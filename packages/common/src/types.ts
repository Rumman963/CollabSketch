import {z} from "zod";

export const UserSchema = z.object({
    email: z.email(),
    name: z.string().min(1),
    password: z.string().min(8, "Password must be at least 8 characters")
});

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string()
});



export const CreateRoomSchema = z.object({
    name: z.string().min(6).max(20)
});