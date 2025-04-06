import { z } from "zod";

export const CreateUserSchema = z.object({
    username : z.string().min(3).max(50),
    email : z.string().email(),
    password : z.string().min(8).max(50),
})

export const SigninSchema = z.object({
    email : z.string().email(),
    password : z.string().min(8).max(50),
})

export const CreateRoomSchema = z.object({
    slug : z.string().min(3).max(50),
})
