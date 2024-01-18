`Firebase v9 + ChakraUI + NextJS`

**TABLE OF CONTENTS**

- [Install](#install)
- [How to init](#how-to-init)
- [How to setup authentication](#how-to-setup-authentication)
  - [Login](#login)
  - [Sign out](#sign-out)

#Firebase

## Install

[react-firebase-hooks](https://www.npmjs.com/package/react-firebase-hooks)

```bash
yarn add firebase react-firebase-hooks
```

## How to init

```js
// firebaseconfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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
```

## How to setup authentication

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
