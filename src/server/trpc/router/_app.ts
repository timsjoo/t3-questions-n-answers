import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { questionRouter } from "./question";
import { answerRouter } from "./answer";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  question: questionRouter,
  answer: answerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
