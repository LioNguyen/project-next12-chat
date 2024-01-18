"use client";

import { Flex, Text } from "@chakra-ui/react";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

import { BottomBar, TopBar } from "@/components/molecules";
import { Sidebar } from "@/components/organisms";
import { auth, db } from "@/firebaseconfig";
import { getOtherEmails } from "@/utils/getOtherEmails";

export default function Chat() {
  const params = useParams();
  const { chatId } = params;

  const [chat] = useDocumentData(doc(db, "chats", chatId as string));

  const q = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp")
  );
  const [messages] = useCollectionData(q);

  const bottomOfChat = useRef<HTMLDivElement>(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!bottomOfChat || !bottomOfChat?.current) return;

    setTimeout(() => {
      bottomOfChat?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, [messages]);

  if (!user) {
    return <></>;
  }

  const getMessages = () =>
    messages?.map((msg) => {
      const sender = msg.sender === user.email;
      return (
        <Flex
          key={Math.random()}
          alignSelf={sender ? "flex-start" : "flex-end"}
          bg={sender ? "blue.100" : "green.100"}
          w="fit-content"
          minWidth="100px"
          borderRadius="lg"
          p={3}
          m={1}
        >
          <Text>{msg.text}</Text>
        </Flex>
      );
    });

  return (
    <Flex h="100vh">
      <Sidebar />

      <Flex flex={1} direction="column">
        <TopBar email={getOtherEmails(chat?.users, user)} />

        <Flex
          flex={1}
          direction="column"
          pt={4}
          mx={5}
          overflowX="scroll"
          sx={{ scrollbarWidth: "none" }}
        >
          {getMessages()}
          <div ref={bottomOfChat}></div>
        </Flex>

        <BottomBar id={chatId as string} user={user} />
      </Flex>
    </Flex>
  );
}
