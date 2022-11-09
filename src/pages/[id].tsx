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

  if (status === "unauthenticated") {
    router.push("/");
  }

  const [answerText, setAnswerText] = useState("");

  const oneQuestion = trpc.question.getOneQuestion.useQuery({ id });
  const answers = trpc.answer.getAnswersByQuestionId.useQuery({ id });
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

  const handleAnswerQuestion = async () => {
    await createAnswer.mutateAsync({
      text: answerText,
      questionId: id,
    });
    setAnswerText("");
  };

  console.log(oneQuestion.data);
  return (
    <>
      <Head>
        <title>{oneQuestion.data?.text}</title>
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-4xl font-bold">{oneQuestion.data?.text}</h1>
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
