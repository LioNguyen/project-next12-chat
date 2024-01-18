"use client";

import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import { auth, db } from "@/firebaseconfig";
import { getOtherEmails } from "@/utils/getOtherEmails";

export function Sidebar() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [user] = useAuthState(auth);
  const [snapshot, loading, error] = useCollection(collection(db, "chats"));

  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !user) {
    return <></>;
  }

  const redirect = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const chatExists = (email: string) =>
    chats?.find(
      (chat: any) =>
        chat.users.includes(user.email) && chat.users.includes(email)
    );

  const newChat = async () => {
    const input = prompt("Enter email of chat recipient") || "";
    if (!chatExists(input) && input != user.email) {
      await addDoc(collection(db, "chats"), { users: [user.email, input] });
    }
  };

  const chatList = () => {
    return chats
      ?.filter((chat: any) => chat?.users.includes(user!.email))
      .map((chat: any) => (
        <Flex
          key={Math.random()}
          p={3}
          align="center"
          _hover={{ bg: "gray.100", cursor: "pointer" }}
          onClick={() => redirect(chat.id)}
        >
          <Avatar src="" marginEnd={3} />
          <Text>{getOtherEmails(chat?.users, user)}</Text>
        </Flex>
      ));
  };

  return (
    <Flex
      // bg="blue.100"
      h="100%"
      w="300px"
      borderEnd="1px solid"
      borderColor="gray.200"
      direction="column"
    >
      <Flex
        // bg="red.100"
        h="81px"
        w="100%"
        align="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="gray.200"
        p={3}
      >
        <Flex align="center">
          <Avatar src={user!.photoURL || undefined} marginEnd={3} />
          <Text>{user!.displayName}</Text>
        </Flex>

        <IconButton
          aria-label="arrow-left-icon"
          size="sm"
          isRound
          icon={<ArrowLeftIcon />}
          onClick={() => signOut(auth)}
        />
      </Flex>

      <Button m={5} p={4} onClick={() => newChat()}>
        New Chat
      </Button>

      <Flex
        overflowX="scroll"
        direction="column"
        sx={{ scrollbarWidth: "none" }}
        flex={1}
      >
        {chatList()}
      </Flex>
    </Flex>
  );
}
