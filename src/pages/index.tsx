import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();

  const [questionText, setQuestionText] = useState("");
  const [categoryText, setCategoryText] = useState("");

  const questions = trpc.question.getAllQuestions.useQuery();
  const createQuestion = trpc.question.createQuestion.useMutation({
    async onMutate(newQuestion) {
      utils.question.getAllQuestions.cancel();
      const prevData: any = utils.question.getAllQuestions.getData();

      if (Array.isArray(prevData)) {
        utils.question.getAllQuestions.setData([...prevData, newQuestion]);
      }

      return { prevData };
    },
    async onSettled() {
      await utils.question.getAllQuestions.invalidate();
    },
  });

  const getAllCategories = trpc.category.getAllCategories.useQuery();
  const createCategory = trpc.category.createCategory.useMutation({
    async onMutate(newCategory) {
      utils.category.getAllCategories.cancel();
      const prevData: any = utils.category.getAllCategories.getData();

      if (Array.isArray(prevData)) {
        utils.category.getAllCategories.setData([...prevData, newCategory]);
      }

      return { prevData };
    },
  });

  const handleCreateCategory = async () => {
    await createCategory.mutateAsync({
      name: categoryText,
    });
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleCreateQuestion = async () => {
    const newQuestion = await createQuestion.mutateAsync({
      text: questionText,
    });
  };

  return (
    <>
      <Head>
        <title>Questions/Answers</title>
        <meta name="description" content="Ask or answer questions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute top-10 right-10 flex flex-col items-center justify-center">
          <h1 className="text-lg">Create Categories</h1>
          <textarea
            className="w-25 m-2 rounded border border-gray-400"
            onChange={(e) => setCategoryText(e.target.value)}
          />
          <button
            onClick={handleCreateCategory}
            className="rounded-lg border border-black p-1 px-3 hover:bg-gray-200"
          >
            Create
          </button>
          {getAllCategories.data?.map((category) => (
            <div
              key={category.id}
              className="mb-2 rounded border border-gray-500 p-2"
            >
              {category.name}
            </div>
          ))}
        </div>
        <h1 className="mb-4 text-4xl font-bold">
          Got a question?{" "}
          {session ? (
            "Ask away"
          ) : (
            <button
              onClick={handleGoogleSignIn}
              className="text-gray-700 hover:text-gray-600"
            >
              Sign In
            </button>
          )}
        </h1>
        {session ? (
          <>
            <textarea
              onChange={(e) => setQuestionText(e.target.value)}
              value={questionText}
              className="w-25 m-2 rounded border border-gray-400"
            />
            <button
              onClick={handleCreateQuestion}
              className="rounded-lg border border-black p-1 px-3 hover:bg-gray-200"
            >
              Ask
            </button>
          </>
        ) : null}

        {questions.data?.map((question) => (
          <div
            key={question.id}
            className="my-4 flex flex-col items-center rounded border border-gray-700 p-3"
          >
            <p>{question.text}</p>
            <Link href={`/${question.id}`} className="text-gray-500">
              Link
            </Link>
          </div>
        ))}
        {session ? (
          <button onClick={() => signOut()} className="hover:text-gray-500">
            Sign Out
          </button>
        ) : null}
      </main>
    </>
  );
};

export default Home;
