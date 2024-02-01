"use client";

import { Center, ChakraProvider, Spinner } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/firebaseconfig";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

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
      router.push("/login");
    } else {
      router.push("/");
    }
    return children;
  };

  return <ChakraProvider>{renderChildren()}</ChakraProvider>;
}
