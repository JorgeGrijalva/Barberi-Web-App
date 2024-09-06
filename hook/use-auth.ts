"use client";

import { useEffect, useState } from "react";
import firebaseApp from "@/lib/firebase";
import { deleteCookie, hasCookie } from "cookies-next";
import useUserStore from "@/global-store/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSearchHistoryStore from "@/global-store/search-history";
import useLikeStore from "@/global-store/like";
import useCartStore from "@/global-store/cart";
import useCompareStore from "@/global-store/compare";
import { useFcmToken } from "@/hook/use-fcm-token";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { signOut: localSignOut } = useUserStore();
  const clearSearchHistory = useSearchHistoryStore((state) => state.clear);
  const clearLikeList = useLikeStore((state) => state.clear);
  const clearCart = useCartStore((state) => state.clear);
  const clearCompareList = useCompareStore((state) => state.clear);
  const { fcmToken } = useFcmToken();
  const { mutate: serverLogout } = useMutation({
    mutationFn: (body: { token: string }) => authService.logout(body),
    mutationKey: ["logout"],
  });
  const handleLogoutLocal = async () => {
    const { signOut, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    setIsSignedIn(false);
    deleteCookie("token");
    localSignOut();
    queryClient.clear();
    clearSearchHistory();
    clearLikeList("product");
    clearCart();
    clearCompareList();
  };
  const logOut = async () => {
    router.replace("/");
    if (fcmToken) {
      serverLogout(
        { token: fcmToken },
        {
          onSuccess: async () => {
            router.replace("/");
            await handleLogoutLocal();
          },
        }
      );
      return;
    }
    await handleLogoutLocal();
  };

  const googleSignIn = async () => {
    const { signInWithPopup, GoogleAuthProvider, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  };

  const appleSignIn = async () => {
    const { signInWithPopup, OAuthProvider, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    const appleAuthProvider = new OAuthProvider("apple.com");
    appleAuthProvider.addScope("email");
    appleAuthProvider.addScope("name");
    return signInWithPopup(auth, appleAuthProvider);
  };

  const facebookSignIn = async () => {
    const { FacebookAuthProvider, signInWithPopup, getAuth } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    const facebookAuthProvider = new FacebookAuthProvider();
    return signInWithPopup(auth, facebookAuthProvider);
  };

  const phoneNumberSignIn = async (phoneNumber: string) => {
    const { getAuth, signInWithPhoneNumber, RecaptchaVerifier } = await import("firebase/auth");
    const auth = getAuth(firebaseApp);
    const appVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      size: "invisible",
      callback: () => {
        console.log("Callback!");
      },
    });
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  useEffect(() => {
    setIsSignedIn(hasCookie("token"));
  }, []);

  return { logOut, googleSignIn, appleSignIn, facebookSignIn, phoneNumberSignIn, isSignedIn };
};
