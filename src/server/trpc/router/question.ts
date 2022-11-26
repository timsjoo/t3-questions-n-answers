import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

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
    return ctx.prisma.question.findMany({
      include: { categories: true },
    });
  }),
  getOneQuestion: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.question.findUnique({
        where: { id: input?.id },
        include: { answers: true, categories: true },
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
  setQuestionCategory: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        categoryId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const addCategoryQuestionThingie =
        ctx.prisma.categoriesQuestionsRelation.create({
          data: {
            assignedById: ctx.session.user.id,
            questionId: input?.questionId,
            categoryId: input?.categoryId,
            assignedAt: new Date(),
          },
        });
      return addCategoryQuestionThingie;

      // // tim's original
      // return ctx.prisma.question.update({
      //   where: { id: input?.questionId },
      //   data: { categoryId: input?.categoryId },
      // });
    }),
});
