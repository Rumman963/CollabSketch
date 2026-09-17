import {z} from "zod";

export const UserSchema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string()
});

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string()
});



export const CreateRoomSchema = z.object({
    name: z.string().min(6).max(20)
});