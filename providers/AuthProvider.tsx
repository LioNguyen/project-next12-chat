"use client";

import React, { ReactNode } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";

import { auth } from "@/firebaseconfig";
import { Login } from "@/components/pages";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);

  console.log("🚀 @log ~ AuthProvider ~ user:", user);

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
