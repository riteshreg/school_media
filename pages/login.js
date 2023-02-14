import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import ReactLinkify from "react-linkify";
import { MutatingDots } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";
import Card from "@/components/Card";

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
  const [showpassword, setShowPassword] = useState(false);

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

  const style = `px-1 w-56 md:w-60 py-2 border ${
    (!error && "border-gray-300") || (error && "border-red-500 border-2")
  } rounded-md outline-green-300`;

  return (
    <div className="h-screen bg-[#1f2937] md:bg-gray-800 w-screen flex flex-col items-center justify-center">
      <Head>
        <title>Janata Mavi</title>
        <meta
          name="description"
          property="og:title"
          content="Janata Mavi Gauradaha-1 Jhapa"
          key="desc"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://janatamavi.vercel.app" />

        {/* <meta
          property="og:image"
          content="https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/images/305480223_576509657594875_840635747841878545_n%20(2).jpg"
        /> */}
        <meta
          property="og:image"
          content="https://ypticbcztdwpynckjwag.supabase.co/storage/v1/object/public/images/305480223_576509657594875_840635747841878545_n.jpg"
        />
      </Head>

      {/* <div className="flex md:w-96 mt-2 items-center flex-col space-y-4">
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
        <div className={`flex ${style}  relative items-center`}>
          <input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            type={`${showpassword ? 'text' : 'password' }`}
            placeholder="password"
            className={"w-[86%] h-full border-none outline-none"}
            name="password"
            onChange={handleChange}
          />
         {showpassword?
         <EyeSlashIcon  onClick={()=>setShowPassword(!showpassword)} className="absolute cursor-pointer text-gray-500  right-1 h-6" />
          :
          
          <EyeIcon  onClick={()=>setShowPassword(!showpassword)} className="absolute cursor-pointer text-gray-500  right-1 h-6" />
         }  
        
        </div>
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
      </div> */}
      <div class="w-full   md:w-96 mx-auto">
        <div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div class="space-y-6">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">
              Janta Mavi School Media
            </h3>
            <div>
              <label
                for="email"
                class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
              >
                Your password
              </label>
              <label className="relative flex justify-center items-center ">
                <input
                  type={`${showpassword ? "text" : "password"}`}
                  name="password"
                  onChange={handleChange}
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  required=""
                />
                {showpassword ? (
                  <EyeSlashIcon
                    onClick={() => setShowPassword(!showpassword)}
                    className="absolute cursor-pointer text-gray-700  right-1 h-6"
                  />
                ) : (
                  <EyeIcon
                    onClick={() => setShowPassword(!showpassword)}
                    className="absolute cursor-pointer text-gray-700  right-1 h-6"
                  />
                )}
              </label>
            </div>
            <div class="flex items-start">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="bg-gray-50 border border-gray-300 focus:ring-3 focus:ring-blue-300 h-4 w-4 rounded dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                <div class="text-sm ml-3">
                  <label
                    for="remember"
                    class="font-medium text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <Link
                href="/change_password"
                class="text-sm text-blue-700 hover:underline ml-auto dark:text-blue-500"
              >
                Change Password
              </Link>
            </div>
            <button
              type="submit"
              onClick={handleLogin}
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login to your account
            </button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?{" "}
              <Link
                target={"_blank"}
                href={"https://forms.gle/8tUKrgrWf1UMDoq86"}
                class="text-blue-700 hover:underline dark:text-blue-500"
              >
                Submit Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
