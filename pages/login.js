import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ReactLinkify from "react-linkify";
import { MutatingDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = () =>
  toast.error("something went wrong", {
    position: "bottom-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });

export default function LoginPage() {



  const supabase = useSupabaseClient();
  const router = useRouter();

  const [loginUser, setLoginUser] = useState({
    email: "",
    password: "",
  });

  const [progress, setProgress] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setError(false);
    setProgress(false);
    setLoginUser((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async () => {
    if (loginUser.email && loginUser.password) {
      setProgress(true);
      const { data, error } = await supabase.auth.signInWithPassword(loginUser);
      if (error) {
        setError(true);
        setProgress(false);
        notify();
      }
      if (data.session?.access_token) {
        setProgress(false);
        router.push("/");
      }
    }
  };

  const style = `px-1 w-56 py-2 border ${
    (!error && "border-gray-300") || (error && "border-red-500 border-2")
  } rounded-md outline-green-300`;

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Head>
      <title>Cool Title</title>
        <meta name="description" content="Checkout our cool page" key="desc" />
        <meta property="og:title" content="Social Title for Cool Page" />
        <meta
          property="og:description"
          content="And a social description for our cool page"
        />
        <meta
          property="og:image"
          content="https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/images/305480223_576509657594875_840635747841878545_n%20(2).jpg"
          
        />
      </Head>

      <div className="flex flex-col space-y-4">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          type="email"
          placeholder="email"
          className={style}
          name="email"
          onChange={handleChange}
        />
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          type="password"
          placeholder="password"
          className={style}
          name="password"
          onChange={handleChange}
        />
        <button
          className="bg-blue-300 px-2 py-2 rounded-md"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      <button
        onClick={() => router.push("/change_password")}
        className="text-blue-900 mt-3"
      >
        Change Password
      </button>
      {progress && (
        <MutatingDots
          height="100"
          width="100"
          color="#635f75"
          secondaryColor="#4fa94d"
          radius="12.5"
          ariaLabel="mutating-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="mt-5">
        <h1 className="text-lg font-mono">
          No credentials,
          <span className="text-blue-600 ml-2">
            <Link
              target={"_blank"}
              href={"https://forms.gle/8tUKrgrWf1UMDoq86"}
            >
              Fill The Form
            </Link>
          </span>
        </h1>
      </div>
    </div>
  );
}
