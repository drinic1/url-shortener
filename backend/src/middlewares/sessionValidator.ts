import { Request, Response, NextFunction } from "express";

const sessionValidator = (req: Request, res: Response, next: NextFunction) => {
  if (
    !req.session ||
    // !req.session.isPopulated ||
    !req.session.id ||
    typeof req.session.id !== "string"
  ) {
    res.status(401).json({ error: "Please log in." });
    return;
  }
  next();
};

export default sessionValidator;
