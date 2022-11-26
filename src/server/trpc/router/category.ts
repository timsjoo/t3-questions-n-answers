import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const categoryRouter = router({
  createCategory: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      const category = ctx.prisma.category.create({
        data: {
          name: input?.name,
        },
      });
      return category;
    }),
  getAllCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
  getOneCategory: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input?.id },
        include: { questions: true },
      });
    }),
  getCategoriesByQuestionId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      console.log({ input });
      return ctx.prisma.categoriesQuestionsRelation.findMany({
        where: { questionId: input?.id },
        include: { category: true },
      });
    }),
});
