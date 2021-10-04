import { Request, Response, NextFunction } from 'express';

const getData = (obj: Record<string, any>, path: string): any => {
  const paths = path.split('.');
  return paths.reduce((acc, dataPath) => acc[dataPath], obj);
};

const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> =>
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
};

export { getData, asyncHandler };
