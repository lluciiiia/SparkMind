import { useRouter } from "next/navigation";

export const HomeNavigation = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between flex-wrap p-4 md:justify-end">
        <menu className="w-full md:w-auto">
          <li className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-center md:justify-end">
            <button className="w-full md:w-auto">HOME</button>
          </li>
        </menu>
        <button
          onClick={() => {
            router.push("/my-learning");
          }}
          className="bg-navy px-8 py-2 mt-4 md:mt-0 md:px-12 md:py-3 ml-0 md:ml-8 text-white rounded-3xl w-full md:w-auto"
        >
          Sign-up
        </button>
      </div>
    </>
  );
};
