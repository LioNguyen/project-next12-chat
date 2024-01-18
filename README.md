`Firebase v9 + ChakraUI + NextJS`

**TABLE OF CONTENTS**

- [Firebase](#firebase)
  - [How to setup on console.firebase](#how-to-setup-on-consolefirebase)
  - [How to setup in app](#how-to-setup-in-app)
  - [Some methods from firebase \& firebase-hooks](#some-methods-from-firebase--firebase-hooks)
  - [How to init](#how-to-init)
  - [How to use authentication](#how-to-use-authentication)
    - [Login](#login)
    - [Sign out](#sign-out)
    - [Get user info](#get-user-info)
  - [How to set data to Firestore Database](#how-to-set-data-to-firestore-database)
  - [How to get data from Firestore Database](#how-to-get-data-from-firestore-database)

# Firebase

## How to setup on console.firebase

[Console firebase](https://console.firebase.google.com)

- Build -> Authentication -> Sign-in method
- Build -> Authentication -> Settings -> Authorized domains: add deployed domain
- Build -> Firestore Database

## How to setup in app

[react-firebase-hooks](https://www.npmjs.com/package/react-firebase-hooks)

```bash
yarn add firebase react-firebase-hooks
```

## Some methods from firebase & firebase-hooks

`Collection references must have an odd number of segments`
`Document references must have an even number of segments`

```js
import { getAuth, signOut } from "firebase/auth";
import { addDoc, collection, getFirestore, orderBy, query } from "firebase/firestore";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

const auth = getAuth();
const db = getFirestore();

// Get user info
const [user, loading, error] = useAuthState(auth);

// Set data to db
await addDoc(collection(db, `chats/${id}/messages`), {
  text: input,
  sender: user.email,
  timestamp: serverTimestamp(),
});

// Get data from db
const [snapshot, loading, error] = useCollection(collection(db, "chats"));
const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

const [chats, loading, error] = useCollectionData(collection(db, "chats"));

const q = query(
  collection(db, `chats/${chatId}/messages`),
  orderBy("timestamp")
);
const [messages] = useCollectionData(q);

const [chat] = useDocumentData(doc(db, "chats", chatId as string));
```

## How to init

```js
// firebaseconfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
```

## How to use authentication

### Login

- Build -> Authentication -> Sign-in method
- Create AuthProvider + Login

```js
// providers/AuthProvider.tsx

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);

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
```

```js
// pages/Login.tsx

import { useSignInWithGoogle } from "react-firebase-hooks/auth";

import { auth } from "@/firebaseconfig";

export function Login() {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  return (
    <>
      {/* Other UI codes */}

      <Button boxShadow="md" onClick={() => signInWithGoogle()}>
        Sign In with Google
      </Button>
    </>
  );
}
```

### Sign out

```js
// Sidebar.tsx

import { signOut } from "firebase/auth";

import { auth } from "@/firebaseconfig";

export function Sidebar() {
  return (
    <IconButton
      aria-label="arrow-left-icon"
      size="sm"
      isRound
      icon={<ArrowLeftIcon />}
      onClick={() => signOut(auth)}
    />
  );
}
```

### Get user info

```js
// Sidebar.tsx

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/firebaseconfig";

export function SideBar() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Flex align="center">
      <Avatar src={user!.photoURL || undefined} marginEnd={3} />
      <Text>{user!.displayName}</Text>
    </Flex>
  )
}
```

## How to set data to Firestore Database

```js
// Sidebar.tsx

import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/firebaseconfig";

export function Sidebar() {
  const newChat = async () => {
    const input = prompt("Enter email of chat recipient") || "";
    if (!chatExists(input) && input != user.email) {
      await addDoc(collection(db, "chats"), { users: [user.email, input] });
    }
  };

  return (
    <Button m={5} p={4} onClick={() => newChat()}>
      New Chat
    </Button>
  );
}
```

```js
// BottomBar.tsx

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
```

## How to get data from Firestore Database

```js
// Sidebar.tsx

import { collection } from "firebase/firestore";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebaseconfig";

export function Sidebar() {
  // useCollection return Query -> ~.docs.map() to return array of value
  // Use this method to get id
  const [snapshot, loading, error] = useCollection(collection(db, "chats"));
  const chats = snapshot?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  // useCollectionData will return array of value
  const [chats, loading, error] = useCollection(collection(db, "chats"));

  return <></>;
}
```

```js
// Chat.tsx

import { collection, doc, orderBy, query } from "firebase/firestore";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";

export default function Chat() {
  const params = useParams();
  const { chatId } = params;

  // useDocumentData returns object
  const [chat] = useDocumentData(doc(db, "chats", chatId as string));


  // useCollectionData returns array of values
    const q = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp")
  );
  const [messages] = useCollectionData(q);

  return <></>
}
```
