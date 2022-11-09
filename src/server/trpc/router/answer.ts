import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const answerRouter = router({
  createAnswer: protectedProcedure
    .input(z.object({ text: z.string(), questionId: z.string() }))
    .mutation(({ input, ctx }) => {
      const answer = ctx.prisma.answer.create({
        data: {
          text: input?.text,
          questionId: input?.questionId,
          authorId: ctx.session.user.id,
        },
      });
      return answer;
    }),
  // get answers by question id
  getAnswersByQuestionId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.answer.findMany({
        where: { questionId: input.id },
      });
    }),
});
