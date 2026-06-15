import { z } from "zod";
import { COMMON } from "../@types/common";
import formErrors from "../constants/formErrors";

export const createAuthSchemas = (options: COMMON.CreateSchemaOptions) => {
  const err = formErrors[options.lang];

  const authSchema = {
    email: z.string(err.REQUIRED).email(err.INVALID_EMAIL),
    password: z.string(err.REQUIRED).min(6, err.PASSWORD_MIN),
    userName: z.string(err.REQUIRED).min(3, err.USERNAME_MIN),
    code: z.string(err.REQUIRED).min(6, err.CODE_MIN),
    token: z.string(err.REQUIRED),
  };

  return {
    signInSchema: z.object({
      email: authSchema.email,
      password: authSchema.password,
    }),
    signUpWithGoogleSchema: z.object({
      token: authSchema.token,
    }),
    signUpWithGithubSchema: z.object({
      code: authSchema.code,
    }),
    signUpSchema: z.object({
      email: authSchema.email,
      password: authSchema.password,
      userName: authSchema.userName,
    }),
    sendRecoveryCodeSchema: z.object({
      email: authSchema.email,
    }),
    verifyRecoveryCodeSchema: z.object({
      email: authSchema.email,
      code: authSchema.code,
    }),
    resetPasswordSchema: z.object({
      newPassword: authSchema.password,
      token: authSchema.token,
    }),
    refreshTokenSchema: z.object({
      token: authSchema.token,
    }),
  };
};
