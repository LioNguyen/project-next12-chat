"use client";

import { BottomBar, TopBar } from "@/components/molecules";
import { Sidebar } from "@/components/organisms";
import { Flex } from "@chakra-ui/react";
import { useRef } from "react";

export default function Chat() {
  const bottomOfChat = useRef<HTMLDivElement>(null);
  return (
    <Flex h="100vh">
      <Sidebar />

      <Flex flex={1} direction="column">
        <TopBar
          // email={getOtherEmail(chat?.users, user)}
          email="test@co.co"
        />

        <Flex
          flex={1}
          direction="column"
          pt={4}
          mx={5}
          overflowX="scroll"
          sx={{ scrollbarWidth: "none" }}
        >
          {/* {getMessages()} */}
          <div ref={bottomOfChat}></div>
        </Flex>

        <BottomBar id={"test"} user={{}} />
      </Flex>
    </Flex>
  );
}
