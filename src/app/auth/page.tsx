"use client";
import { FormEvent, useState, useEffect } from 'react';
import { auth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, FacebookAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { MdFacebook } from 'react-icons/md';
import { LiaEyeSlashSolid, LiaEyeSolid  } from "react-icons/lia";

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true); // Toggle between Login and SignUp
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: string; text: string } | null>(null);

   // Load saved email from localStorage if "Remember Me" was previously checked
   useEffect(() => {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }, []);
  
    const handleRememberMe = () => {
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    };

  // Handle form submit for Login or SignUp
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    // Remember Me logic
    handleRememberMe();

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setStatusMessage({ type: 'success', text: 'Signed in successfully!' });
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setStatusMessage({ type: 'success', text: 'Account created successfully!' });
      }
      setEmail("")
      setPassword("")
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Error with authentication. Check your details and try again.' });
    }
  };


  const handleGoogleSignIn = async (): Promise<void> => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Google sign-in error:', (error as Error).message);
    }
  };

  const handleFacebookSignIn = async (): Promise<void> => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in:', result.user);
    } catch (error) {
      console.error('Facebook sign-in error:', (error as Error).message);
    }
  };

  

  const handleForgotPassword = async () => {
   setStatusMessage(null);

   if (!email) {
     setStatusMessage({ type: 'error', text: 'Please enter your email to reset your password.' });
     return;
   }

   try {
     await sendPasswordResetEmail(auth, email);
     setStatusMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
   } catch (error) {
     setStatusMessage({ type: 'error', text: 'Error sending password reset email. Try again later.' });
   }
 };


  return (
    <>
      <div className="flex min-h-full 2xl:h-screen flex-1">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-10 w-auto"
              />
              <h2 className="mt-8 text-2xl/9 font-bold tracking-tight text-gray-500">
                {isLogin ? 'Sign in to your account' : 'Create an account'}
              </h2>
              <p className="mt-2 text-sm/6 text-gray-500">
                {isLogin ? 'Not a member? ' : 'Already have an account? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {isLogin ? 'Start a free trial' : 'Sign in'}
                </button>
              </p>
            </div>

            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 text-gray-600 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                {!isForgotPassword && (
                     <div className='mt-2'>
                     <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                       Password
                     </label>
                     <div className="mt-2 relative">
                       <input
                         id="password"
                         name="password"
                         type={showPassword ? 'text' : 'password'} // Toggle input type
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}  
                         required
                         autoComplete="current-password"
                         className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                       />
                        <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                         className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                       >
                         {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
                       </button>
                     </div>
                   </div>
                  )}
                {statusMessage && (
                     <div
                     className={`text-sm font-medium p-2 rounded ${
                        statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                     }`}
                     >
                     {statusMessage.text}
                     </div>
               )}

                  {!isForgotPassword && (
                     <div className="flex items-center justify-between">
                     <div className="flex items-center">
                        <input
                           id="remember-me"
                           name="remember-me"
                           type="checkbox"
                           checked={rememberMe}
                           onChange={(e) => setRememberMe(e.target.checked)}
                           className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                           Remember me
                        </label>
                     </div>

                     <div className="text-sm">
                        <button
                           type="button"
                           onClick={() => setIsForgotPassword(true)}
                           className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                           Forgot your password?
                        </button>
                     </div>
                     </div>
                  )}

                  <div>
                     {isForgotPassword ? (
                     <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        Send Reset Email
                     </button>
                     ) : (
                     <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        {isLogin ? 'Sign in' : 'Sign up'}
                     </button>
                     )}
                  </div>
                  {isForgotPassword && (
                     <div className="text-center mt-4">
                     <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                     >
                        Back to Login
                     </button>
                     </div>
                  )}
              </form>

              <div className="mt-10">
                <div className="relative">
                  <div aria-hidden="true" className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm/6 font-medium">
                    <span className="bg-black px-6 text-white">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                      <path
                        d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                        fill="#EA4335"
                      />
                      <path
                        d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.275 17.3899L5.26498 14.2949Z"
                        fill="#34A853"
                      />
                      <path
                        d="M12 4.75C9.485 4.75 7.30003 6.22 6.67503 8.08598L2.48503 5.22098C3.63503 3.24098 5.68003 2 7.83503 2.515C9.45503 3.065 10.375 4.75 12 4.75Z"
                        fill="#FBBC05"
                      />
                    </svg>
                    Google
                  </button>

                  <button
                    onClick={handleFacebookSignIn}
                    className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                  >
                     <MdFacebook className='text-blue-700 text-xl w-8 h-8 font-bold' />
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0  flex-1 lg:block">
           <img
             alt=""
             src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
             className="absolute inset-0 size-full object-cover"
           />
         </div>
      </div>
    </>
  );
}
