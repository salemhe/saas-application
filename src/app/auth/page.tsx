"use client";
import { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, FacebookAuthProvider, sendPasswordResetEmail, updateProfile, getIdToken } from 'firebase/auth';
import { MdFacebook } from 'react-icons/md';
import { LiaEyeSlashSolid, LiaEyeSolid  } from "react-icons/lia";
import { auth, db } from '../../../firebase';
import Image from 'next/image';
// import { onAuthStateChanged } from "firebase/auth";
import Logo from '@/assets/logosaas.png'
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  // const [error, setError] = useState<string | null>(null);
  // const [isLogin, setIsLogin] = useState<boolean>(true); // Toggle between Login and SignUp
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: string; text: string } | null>(null);
  const router = useRouter();
 
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    // Extract 'mode' from the query and set the initial state
    const mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'login') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);
  

// useEffect(() => {
//   const unsubscribe = onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log("User's Name:", user.displayName);
//     }
//   });

//   return () => unsubscribe();
// }, []);

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
    handleRememberMe();
  
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = await getIdToken(userCredential.user); // Get JWT Token
        console.log("JWT Token:", token);

        // Store credentials in Firestore for email/password sign-in
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: userCredential.user.displayName || "Anonymous",
          email: userCredential.user.email,
          provider: "email/password",
          token: token, // Save the JWT token
        });

        setStatusMessage({ type: 'success', text: 'Signed in successfully!' });
        router.push('/dashboard');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
        // Save the user's name
        if (name.trim()) {
          await updateProfile(userCredential.user, { displayName: name });
        }

        // Get JWT Token
        const token = await getIdToken(userCredential.user);
        console.log("JWT Token:", token);

        // Store credentials in Firestore for email/password sign-up
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          provider: "email/password",
          token: token, // Save the JWT token
        });

        setStatusMessage({ type: 'success', text: 'Account created successfully!' });
      }
  
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error('Error with authentication:', (error as Error).message);
      setStatusMessage({ type: 'error', text: 'Error with authentication. Check your details and try again.' });
    }
  };

  const handleProviderSignIn = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

       // Get JWT Token
       const token = await getIdToken(user);
       console.log("JWT Token:", token);
  
      // Check if user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);
      router.push('/dashboard');
      if (!userSnapshot.exists()) {
        // Save user data in Firestore
        await setDoc(userDocRef, {
          name: user.displayName || "Anonymous",
          email: user.email,
          profileImage: user.photoURL, // Save profile image from OAuth
          provider: provider instanceof GoogleAuthProvider ? "google" : "facebook",
          token: token,
        });
      }
  
      console.log("User signed in and data saved!");
      
    } catch (error) {
      console.error("Error signing in with provider:", error);
    }
  };
  
  // Example Usage
  const handleGoogleSignIn = () => handleProviderSignIn(new GoogleAuthProvider());
  const handleFacebookSignIn = () => handleProviderSignIn(new FacebookAuthProvider());

  

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
     console.error('Error sending password reset email:', (error as Error).message);
     setStatusMessage({ type: 'error', text: 'Error sending password reset email. Try again later.', });
   }
 };


  return (
    <>
    <div className="flex justify-center items-center min-h-screen 2xl:h-screen  p-0 lg:p-0">
  <div className={`${isLogin ? "py-1" : "py-10"} flex flex-1 flex-col justify-center px-4  sm:px-6 lg:flex-none lg:px-20 xl:px-24`}>
    <div className="mx-auto w-full max-w-sm lg:w-96 bg-white/65 backdrop-blur-md p-6 rounded-lg shadow-lg">
      <div className="text-center">
        <Image onClick={() => router.push('/')} src={Logo} alt="Saas Logo" height={40} width={40} className="cursor-pointer mx-auto" />
        <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
          {isLogin ? 'Sign in to your account' : 'Create an account'}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {isLogin ? 'Not a member? ' : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {isLogin ? 'Start a free trial' : 'Sign in'}
          </button>
        </p>
      </div>

      <div className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin} // Require name only for sign-up
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-900">
                  Remember me
                </label>
              </div>

              {isLogin && (
                <div className="text-xs">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          )}

          <div>
            {isForgotPassword ? (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Reset Email
              </button>
            ) : (
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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

        <div className="mt-5">
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs font-medium">
              <span className="bg-white/65 backdrop-blur-md  px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
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
              className="w-full flex items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent">
                     <MdFacebook className='text-blue-700  w-10 h-10 sm:w-8 sm:h-8 font-bold' />
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
