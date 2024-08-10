"use client";

import { useEffect, useState } from "react";
import { signInWithOAuth } from "@/utils/auth/client";
import type { Provider } from "@supabase/supabase-js";
import { FaGoogle } from "react-icons/fa";

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: JSX.Element;
};

export const OauthSignIn = () => {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: "google",
      displayName: "Google",
      icon: <FaGoogle className="h-5 w-5" />,
    },
    /* Add desired OAuth providers here */
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initiateOAuth = async () => {
      setIsSubmitting(true);
      await signInWithOAuth(); // Automatically use the first provider or select one as needed
      setIsSubmitting(false);
    };

    initiateOAuth();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="mt-8">
      <div className="text-xl font-bold">Connecting with Google ...</div>
    </div>
  );
};
