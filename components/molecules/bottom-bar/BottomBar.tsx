import { Button, FormControl, Input } from "@chakra-ui/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FormEvent, useState } from "react";

import { db } from "@/firebaseconfig";

interface BottomBarProps {
  id: string;
  user: any;
}

export function BottomBar({ id, user }: BottomBarProps) {
  const [input, setInput] = useState("");

  const sendMessage = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    await addDoc(collection(db, `chats/${id}/messages`), {
      text: input,
      sender: user.email,
      timestamp: serverTimestamp(),
    });
    setInput("");
  };

  return (
    <FormControl p={3} onSubmit={sendMessage} as="form">
      <Input
        placeholder="Type a message..."
        autoComplete="off"
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <Button type="submit" hidden>
        Submit
      </Button>
    </FormControl>
  );
}
