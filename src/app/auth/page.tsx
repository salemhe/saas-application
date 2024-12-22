"use client";
import { useState, useEffect, useCallback } from 'react';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, FacebookAuthProvider, sendPasswordResetEmail, updateProfile, getIdToken, sendEmailVerification } from 'firebase/auth';
import { MdFacebook } from 'react-icons/md';
import { LiaEyeSlashSolid, LiaEyeSolid  } from "react-icons/lia";
import { auth, db } from '../../../firebase';
import Image from 'next/image';
import Logo from '@/assets/logosaas.png'
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

// Password complexity validation
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};



// Login attempt tracking
interface LoginAttempt {
  timestamp: number;
  successful: boolean;
}

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: string; text: string } | null>(null);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  // Login attempt management
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
 
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState<boolean>(false);

   // Check login attempts and implement rate limiting
   const checkLoginAttempts = useCallback(() => {
    const currentTime = Date.now();
    const recentAttempts = loginAttempts.filter(
      attempt => currentTime - attempt.timestamp < 15 * 60 * 1000 // 15 minutes
    );

    // Lock account after 5 failed attempts in 15 minutes
    const failedAttempts = recentAttempts.filter(attempt => !attempt.successful);
    if (failedAttempts.length >= 5) {
      setIsLocked(true);
      setStatusMessage({ 
        type: 'error', 
        text: 'Too many failed attempts. Please try again later.' 
      });
      
      // Automatically unlock after 15 minutes
      setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts([]);
      }, 15 * 60 * 1000);
    }
  }, [loginAttempts]);

  useEffect(() => {
    checkLoginAttempts();
  }, [checkLoginAttempts]);


  useEffect(() => {
    // Extract 'mode' from the query and set the initial state
    const mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'login') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

   // Load saved email from localStorage if "Remember Me" was previously checked
   useEffect(() => {
      const savedEmail = sessionStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }, []);

    const refreshSession = async () => {
      try {
        const response = await fetch('/api/refresh', { method: 'POST' });
        if (!response.ok) throw new Error('Failed to refresh session');
      } catch (error) {
        console.error('Session refresh error:', error);
        // Optionally, redirect to login if refresh fails
      }
    };
    
    useEffect(() => {
      const interval = setInterval(refreshSession, 60 * 60 * 1000); // Every hour
      return () => clearInterval(interval);
    }, []);
    
  
    const handleRememberMe = () => {
      if (rememberMe) {
        sessionStorage.setItem('rememberedEmail', email);
      } else {
        sessionStorage.removeItem('rememberedEmail');
      }
    };


  // Handle form submit for Login or SignUp
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);
    handleRememberMe();

     // Check if account is locked
     if (isLocked) {
      setStatusMessage({ 
        type: 'error', 
        text: 'Account temporarily locked. Please try again later.' 
      });
      return;
    }

    // Password complexity validation for signup
    if (!isLogin) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setPasswordErrors(passwordValidation.errors);
        return;
      }
    }

  
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Record successful login attempt
        setLoginAttempts(prev => [
          ...prev, 
          { timestamp: Date.now(), successful: true }
        ]);
        
        // Check if email is verified before allowing login
        if (!userCredential.user.emailVerified) {
          setIsEmailVerificationRequired(true);
          setStatusMessage({ 
            type: 'error', 
            text: 'Please verify your email before logging in. Check your inbox.' 
          });
          return;
        }

        setStatusMessage({ type: 'success', text: 'Signed in successfully!' });
        router.push('/dashboard');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
        // Save the user's name
        if (name.trim()) {
          await updateProfile(userCredential.user, { displayName: name });
        }

        // Send email verification
        await sendEmailVerification(userCredential.user);

        const token = await getIdToken(userCredential.user);

        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          provider: "email/password",
          token: token,
          emailVerified: false, // Initially set to false
          createdAt: serverTimestamp(),
        });

        setStatusMessage({ 
          type: 'success', 
          text: 'Account created! Please check your email to verify your account.' 
        });
        
        // Set state to show verification message
        setIsEmailVerificationRequired(true);
      }
  
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
           // Record failed login attempt
           setLoginAttempts(prev => [
            ...prev, 
            { timestamp: Date.now(), successful: false }
          ]);
    
          const firebaseError = error as FirebaseError;
          let errorMessage = 'Authentication failed';
          
          switch (firebaseError.code) {
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password. Please try again.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many failed attempts. Please try again later.';
              break;
            default:
              errorMessage = 'Authentication failed. Please check your credentials.';
          }
          
          setStatusMessage({ type: 'error', text: errorMessage });
    }
    
  };

  const renderPasswordErrors = () => {
    if (passwordErrors.length > 0) {
      return (
        <div className="mt-2 text-sm text-red-600">
          {passwordErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      );
    }
    return null;
  };
  useEffect(() => {
    if (passwordErrors.length > 0) {
      const timer = setTimeout(() => {
        setPasswordErrors([]);
      }, 11000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [passwordErrors]);

  
  

  const handleProviderSignIn = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Optional: Send verification email for new OAuth users if not already verified
      if (!user.emailVerified) {
        await sendEmailVerification(user);

         // Prevent login if verification is mandatory
        throw new Error('Email not verified');  
      
      }

      const token = await getIdToken(user);
  
      const userDocRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDocRef);
      
      if (!userSnapshot.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName || "Anonymous",
          email: user.email,
          profileImage: user.photoURL,
          provider: provider instanceof GoogleAuthProvider ? "google" : "facebook",
          token: token,
          emailVerified: user.emailVerified
        });
      }
  
      router.push('/dashboard');
      
    } catch (error) {
      console.error("Error signing in with provider:", error);
    }
  };

  const [verificationEmailAttempts, setVerificationEmailAttempts] = useState(0);
const [canResendAt, setCanResendAt] = useState<number | null>(null);

const handleResendVerification = async () => {
  const currentTime = Date.now();

  // Check if there's a cooldown period
  if (canResendAt && currentTime < canResendAt) {
    const remainingSeconds = Math.ceil((canResendAt - currentTime) / 1000);
    setStatusMessage({
      type: 'error',
      text: `Please wait ${remainingSeconds} seconds before requesting another verification email.`
    });
    return;
  }

  try {
    // Limit to 3 attempts within a 24-hour period
    if (verificationEmailAttempts >= 3) {
      setStatusMessage({
        type: 'error',
        text: 'Maximum verification email attempts reached. Please try again later.'
      });
      return;
    }

    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      setStatusMessage({ type: 'error', text: 'No user is signed in.' });
    }
    

    // Set cooldown (5 minutes between resends)
    const nextResendTime = currentTime + 5 * 60 * 1000; // 5 minutes
    setCanResendAt(nextResendTime);

    // Increment attempts
    setVerificationEmailAttempts(prev => prev + 1);

    setStatusMessage({
      type: 'success',
      text: 'Verification email resent! Please check your inbox.'
    });

    // Optional: Reset attempts after 24 hours
    setTimeout(() => {
      setVerificationEmailAttempts(0);
    }, 24 * 60 * 60 * 1000);

  } catch (error) {
    console.error('Resend verification error:', error);
    setStatusMessage({
      type: 'error',
      text: 'Failed to resend verification email. Please try again.'
    });
  }
};
  // Render additional verification message if needed
  const renderVerificationMessage = () => {
    if (isEmailVerificationRequired) {
      return (
        <div className="mt-4 text-center bg-blue-100 text-blue-700 p-3 rounded-md">
          <p>Email verification required. Please check your inbox.</p>
          <button 
            onClick={handleResendVerification}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            Resend verification email
          </button>
        </div>
      );
    }
    return null;
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
      {renderVerificationMessage()}
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
          {
          // !isLogin && (
            !isForgotPassword && (
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
                {!isLogin && renderPasswordErrors()}
              </div>
            // )
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
