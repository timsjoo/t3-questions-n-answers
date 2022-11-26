import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const QuestionPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();
  const id = router.query.id as string;

  console.log("THE ONE WE CARE ABOUT", { id });

  if (status === "unauthenticated") {
    router.push("/");
  }

  const [answerText, setAnswerText] = useState("");

  // tRPC - questions stuff
  const oneQuestion = trpc.question.getOneQuestion.useQuery(
    { id },
    {
      enabled: Boolean(id),
    }
  );
  const answers = trpc.answer.getAnswersByQuestionId.useQuery(
    { id },
    {
      enabled: Boolean(id),
    }
  );
  const createAnswer = trpc.answer.createAnswer.useMutation({
    async onMutate(newAnswer) {
      utils.answer.getAnswersByQuestionId.cancel();
      const prevData: any = utils.answer.getAnswersByQuestionId.getData();

      if (Array.isArray(prevData)) {
        utils.answer.getAnswersByQuestionId.setData([...prevData, newAnswer]);
      }

      return { prevData };
    },

    async onSettled() {
      await utils.answer.getAnswersByQuestionId.invalidate();
    },
  });

  const setQuestionCategory = trpc.question.setQuestionCategory.useMutation({
    async onMutate(newCategory) {
      utils.category.getCategoriesByQuestionId.cancel();
      const prevData: any = utils.category.getCategoriesByQuestionId.getData();

      if (Array.isArray(prevData)) {
        utils.category.getCategoriesByQuestionId.setData([
          ...prevData,
          newCategory,
        ]);
      }

      return { prevData };
    },

    async onSettled() {
      await utils.category.getCategoriesByQuestionId.invalidate();
    },
  });
  const getCategoriesByQuestionId =
    trpc.category.getCategoriesByQuestionId.useQuery({ id }, { enabled: !!id });

  // tRPC - categories stuff
  const getAllCategories = trpc.category.getAllCategories.useQuery();

  const handleAnswerQuestion = async () => {
    await createAnswer.mutateAsync({
      text: answerText,
      questionId: id,
    });
    setAnswerText("");
  };

  const handleSetQuestionCategory = async (
    categoryId: string,
    questionId: string
  ) => {
    await setQuestionCategory.mutateAsync({
      categoryId,
      questionId,
    });
  };

  // console.log(getCategoriesByQuestionId.data);

  return (
    <>
      <Head>
        <title>{oneQuestion.data?.text}</title>
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className=" text-4xl font-bold">{oneQuestion.data?.text}</h1>
        <h2 className="absolute top-10 right-10">
          Set Category:{" "}
          {getAllCategories.data?.map((category) => (
            <button
              key={category.id}
              className="mb-2 rounded border border-gray-500 p-2"
              onClick={() => handleSetQuestionCategory(category.id, id)}
            >
              {category.name}
            </button>
          ))}
        </h2>
        <h2>
          {getCategoriesByQuestionId.data?.map((category) => (
            <div key={category.categoryId}>{category.category.name}</div>
          ))}
        </h2>
        {answers.data?.map((answer) => (
          <div
            key={answer.id}
            className="mb-2 rounded border border-gray-500 p-2"
          >
            {answer.text}
          </div>
        ))}
        <textarea
          className="mb-4 rounded border border-gray-500"
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />
        <button onClick={handleAnswerQuestion}>Submit</button>
      </main>
    </>
  );
};

export default QuestionPage;
