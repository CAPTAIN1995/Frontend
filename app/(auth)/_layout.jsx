import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href={"/"} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
// THIS PAGE CHECK IF THE USER SIGN IN OR NOT