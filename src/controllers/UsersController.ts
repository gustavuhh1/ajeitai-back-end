import { Request, Response } from "express";
import { z } from "zod";
import { registerClientFactory } from "@/usecases/factories/registerClientFactory";
import { registerProviderFactory } from "@/usecases/factories/registerProviderFactory";

export class UsersController {
  async registerClient(req: Request, res: Response): Promise<void> {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        image: z.string().optional(),
        password: z.string().optional(),
        phone: z.string().optional(),
        cpf: z.string(),
      });

      const data = registerBodySchema.parse(req.body);

      const useCase = registerClientFactory();
      const user = await useCase.execute(data);

      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async registerProvider(req: Request, res: Response): Promise<void> {
    try {
      const registerBodySchema = z.object({
        name: z.string(),
        email: z.email(),
        password: z.string().optional(),
        cpf: z.string(),
        image: z.string().optional(),
        phone: z.string().optional(),
        birthDate: z.coerce.date(),
        description: z.string().min(100),
      });

      const data = registerBodySchema.parse(req.body);

      const useCase = registerProviderFactory();
      const user = await useCase.execute(data);

      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const updateBodySchema = z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
      });

      const data = updateBodySchema.parse(req.body);

      // Importar a factory localmente para evitar circular dependency issues se houver, ou apenas import no topo.
      const {
        updateUserProfileFactory,
      } = require("@/usecases/factories/updateUserProfileFactory");
      const useCase = updateUserProfileFactory();

      await useCase.execute({
        userId: req.user!.id,
        ...data,
      });

      res.status(200).json({ message: "Perfil atualizado com sucesso" });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const {
        changePasswordFactory,
      } = require("@/usecases/users/factories/ChangePasswordFactory");
      const useCase = changePasswordFactory();

      await useCase.execute(req.headers as any, req.body);
      res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const {
        forgotPasswordFactory,
      } = require("@/usecases/users/factories/ForgotPasswordFactory");
      const useCase = forgotPasswordFactory();

      const bodyScheme = z.object({
        email: z.email(),
        redirectTo: z.string().default("http://localhost:3000/redefinir-senha"), // Url onde deve inserir o token ou seguir link do email enviado
      });
      const data = bodyScheme.parse(req.body);

      await useCase.execute(data);
      res.status(200).json({ message: "E-mail de recuperação enviado com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const {
        resetPasswordFactory,
      } = require("@/usecases/users/factories/ResetPasswordFactory");
      const useCase = resetPasswordFactory();

      await useCase.execute(req.body);
      res.status(200).json({ message: "Senha redefinida com sucesso" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
