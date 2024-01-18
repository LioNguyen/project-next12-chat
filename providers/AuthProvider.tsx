"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";

import { auth } from "@/firebaseconfig";
import { Login } from "@/components/pages";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [isMounted, setIsMounted] = useState(false);

  if (process.env.NODE_ENV === "development") {
    console.log("🚀 @log ~ AuthProvider ~ user:", user);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <></>;
  }

  const renderChildren = () => {
    if (loading) {
      return (
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      );
    }

    if (!user) {
      return <Login />;
    }
    return children;
  };

  return <ChakraProvider>{renderChildren()}</ChakraProvider>;
}
