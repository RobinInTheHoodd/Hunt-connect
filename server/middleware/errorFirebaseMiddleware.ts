import { Request, Response, NextFunction } from "express";

export interface FirebaseError extends Error {
  errorType: string;
  code?: any;
  detail?: any;
}

const errorFirebaseMiddleware = (
  err: FirebaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.errorType == "firebase") {
    switch (err.code) {
      case "auth/email-already-exists":
        return res.status(409).json({
          message:
            "Cette adresse e-mail est déjà utilisée par un autre compte.",
          field: "email",
        });
      case "auth/invalid-uid":
        return res.status(409).json({
          message: "Invalid id pour cette utilisateur",
          field: "uid",
        });
      case "auth/invalid-email":
        return res.status(400).json({
          message: "L'adresse e-mail fournie est invalide.",
          field: "email",
        });
      case "auth/weak-password":
        return res.status(400).json({
          message:
            "Le mot de passe fourni est trop faible. Il doit contenir au moins 6 caractères.",
          field: "password",
        });
      case "auth/internal-error":
        return res.status(500).json({
          message:
            "Une erreur interne est survenue. Veuillez réessayer plus tard.",
          field: "unknown",
        });
      case "auth/invalid-credential":
        return res.status(400).json({
          message:
            "Les informations d'identification fournies sont invalides ou mal formées.",
          field: "credential",
        });
      case "auth/invalid-id-token":
        return res.status(401).json({
          message: "Le jeton d'identification fourni est invalide.",
          field: "token",
        });
      case "auth/invalid-password":
        return res.status(400).json({
          message:
            "Le mot de passe fourni est invalide. Il doit contenir au moins 6 caractères.",
          field: "password",
        });
      case "auth/invalid-phone-number":
        return res.status(400).json({
          message: "Le numéro de téléphone fourni est invalide.",
          field: "phone",
        });
      case "auth/phone-number-already-exists":
        return res.status(409).json({
          message:
            "Ce numéro de téléphone est déjà utilisé par un autre compte.",
          field: "phone",
        });
      default:
        return res.status(500).json({
          message: "Erreur interne du serveur.",
          field: "unknown",
        });
    }
  } else next(err);
};

export default errorFirebaseMiddleware;
