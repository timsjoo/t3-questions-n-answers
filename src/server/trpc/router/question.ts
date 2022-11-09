import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { createGzip } from "zlib";

export const questionRouter = router({
  createQuestion: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input, ctx }) => {
      const question = ctx.prisma.question.create({
        data: {
          text: input?.text,
          authorId: ctx.session.user.id,
        },
      });
      return question;
    }),
  getAllQuestions: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.question.findMany();
  }),
  getOneQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.question.findUnique({
        where: { id: input?.id },
        include: { answers: true },
      });
    }),
  updateQuestion: protectedProcedure
    .input(z.object({ id: z.string(), text: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.question.update({
        where: { id: input?.id },
        data: { text: input?.text },
      });
    }),
  deleteQuestion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.question.delete({
        where: { id: input?.id },
      });
    }),
});
