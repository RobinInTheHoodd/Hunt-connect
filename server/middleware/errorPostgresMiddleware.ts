import { Request, Response, NextFunction } from "express";

export interface DatabaseError extends Error {
  errorType: string;
  code?: any;
  detail?: any;
}

const errorPostgresMiddleware = (
  err: DatabaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err.errorType == "postgres") {
    switch (err.code) {
      case "23505":
        // Gérer une violation de contrainte unique
        const violatedConstraint = err.detail
          ? err.detail.match(/Key \((.*?)\)=/)
          : null;
        const fieldName = violatedConstraint
          ? violatedConstraint[1]
          : "unspecified field";
        return res.status(409).json({
          message: `La valeur pour le champ '${fieldName}' existe déjà.`,
          field: fieldName,
        });
      case "23503":
        // Gérer une violation de contrainte de clé étrangère
        const foreignKeyViolation = err.detail
          ? err.detail.match(
              /Key \((.*?)\)=\((.*?)\) is not present in table "(.*?)"/
            )
          : null;
        const fieldNameFK = foreignKeyViolation
          ? foreignKeyViolation[1]
          : "unspecified field";
        const fieldValueFK = foreignKeyViolation
          ? foreignKeyViolation[2]
          : "unknown value";
        return res.status(422).json({
          message: `La valeur '${fieldValueFK}' pour le champ '${fieldNameFK}' n'existe pas.`,
          field: fieldNameFK,
        });
      case "23502":
        // Gérer une violation de contrainte de non null
        const nonNullViolationFull = err.message
          ? err.message.match(/column "(.*?)" /)
          : null;
        const fieldNameNN = nonNullViolationFull
          ? nonNullViolationFull[1]
          : "unspecified field";
        return res.status(400).json({
          message: `Une valeur est requise pour le champ '${fieldNameNN}'`,
          field: fieldNameNN,
        });
      case "22P02":
        // Gérer une erreur de format de données invalide
        const invalidDataFormat = err.detail
          ? err.detail.match(/invalid input syntax for type (.*?): "(.*?)"/)
          : null;
        const dataType = invalidDataFormat
          ? invalidDataFormat[1]
          : "unspecified type";
        const invalidValue = invalidDataFormat
          ? invalidDataFormat[2]
          : "unknown value";
        return res.status(400).json({
          message: `Format invalide pour la valeur '${invalidValue}'. Attendu: ${dataType}.`,
          dataType: dataType,
          invalidValue: invalidValue,
        });
      default:
        return res.status(500).json({
          message: "Erreur interne du serveur.",
          field: "unknown",
        });
    }
  }
  next(err);
};

export default errorPostgresMiddleware;
