import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../middlewares/validateBody.js";
import { loginUserSchema, registerUserSchema, requestResetEmailSchema, resetPasswordSchema } from "../validation/auth.js";
import { loginUserController, logoutUserController, refreshUserSessionController, registerUserController, requestResetEmailController, resetPasswordController } from "../controllers/auth.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

authRouter.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

authRouter.post("/logout", ctrlWrapper(logoutUserController));

authRouter.post("/refresh", ctrlWrapper(refreshUserSessionController));

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;