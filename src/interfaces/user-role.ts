import { userRoleEnum } from "~/server/db/schema";

export type UserRole = (typeof userRoleEnum.enumValues)[number];
