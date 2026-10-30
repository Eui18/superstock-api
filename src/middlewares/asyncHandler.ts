import { NextFunction, Request, Response } from "express";

type AsyncRoute = (req: Request, res: Response) => Promise<void>;

export const asyncHandler =
  (fn: AsyncRoute) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };