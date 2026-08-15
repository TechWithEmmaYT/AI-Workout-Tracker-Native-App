import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { isOnboardingCompleted } from "@/constants/onboarding";
import { authClient } from "@/lib/auth-client";
import {
  SignInFormValues,
  signInSchema,
} from "@/lib/validations/auth-validation";
import { useAppThemeColor } from "@/theme/app-theme";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

const googleLogo = require("../../../assets/images/app-images/google-logo.png");

const SignIn = () => {
  const router = useRouter();
  const foreground = useAppThemeColor("foreground");
  const iconColor = useAppThemeColor("mutedForeground");
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const hasCompletedOnboarding = isOnboardingCompleted();
  const signUpHref = hasCompletedOnboarding
    ? ("/sign-up" as const)
    : ({
        pathname: "/onboarding/[step]",
        params: { step: "gender" },
      } as const);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(signInSchema),
    shouldFocusError: false,
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setIsPending(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        Alert.alert("Could not create account", error.message);
        return;
      }
    } finally {
      setIsPending(false);
    }
  });

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        callbackURL: "/",
        provider: "google",
      });
      if (error) {
        Alert.alert("Could not signup with google", error.message);
        return;
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };
  return (
    <SafeAreaScreen>
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerClassName="flex-grow"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-grow px-5 pb-5 pt-12">
          <View>
            <Text className="font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground">
              Welcome back
            </Text>
            <Text className="mt-1 font-inter text-[14px] leading-5 text-muted-foreground">
              Sign in to continue
            </Text>
          </View>

          <View className="mt-10 gap-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="gap-2">
                  <Text className="font-inter-medium text-[14px] text-foreground">
                    Email
                  </Text>
                  <TextInput
                    ref={emailInputRef}
                    autoCapitalize="none"
                    textContentType="emailAddress"
                    autoComplete="email"
                    className={`h-14 rounded-xl border bg-input px-4 font-inter text-[14px] text-foreground ${errors.email ? "border-destructive" : "border-input-border"}`}
                    value={value}
                    inputMode="email"
                    placeholder="you@example.com"
                    placeholderTextColor={iconColor}
                    selectionColor={foreground}
                    returnKeyType="next"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                  />
                  {errors.email && (
                    <Text className="font-inter text-[12px] text-destructive">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onBlur, onChange, value } }) => (
                  <View className="gap-2">
                    <Text className="font-inter-medium text-[14px] text-foreground">
                      Password
                    </Text>
                    <View
                      className={`h-14 flex-row items-center rounded-xl border
                       bg-input px-4 ${errors.password ? "border-destructive" : "border-input-border"}`}
                    >
                      <TextInput
                        ref={passwordInputRef}
                        autoCapitalize="none"
                        autoComplete="new-password"
                        textContentType="newPassword"
                        className="h-full flex-1 font-inter text-[14px] text-foreground"
                        value={value}
                        placeholder="Create a password"
                        placeholderTextColor={iconColor}
                        returnKeyType="done"
                        secureTextEntry={!isPasswordVisible}
                        selectionColor={foreground}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onSubmitEditing={onSubmit}
                      />
                      <Pressable
                        accessibilityLabel={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                        accessibilityRole="button"
                        className="-mr-3 h-11 w-11 items-center justify-center"
                        hitSlop={4}
                        onPress={() =>
                          setIsPasswordVisible((current) => !current)
                        }
                      >
                        <Feather
                          color={iconColor}
                          name={isPasswordVisible ? "eye-off" : "eye"}
                          size={22}
                        />
                      </Pressable>
                    </View>
                    {errors.password && (
                      <Text className="font-inter text-[12px] text-destructive">
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Pressable
                className="mt-3 min-h-11 self-end justify-center"
                onPress={() => alert("Password reset")}
              >
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>
          </View>

          <Button
            className="mt-10"
            disabled={isPending || isGoogleLoading}
            isLoading={isPending}
            onPress={onSubmit}
          >
            Sign In
          </Button>

          <View className="my-7 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-inter text-[12px] text-muted-foreground">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="gap-3">
            <Button
              variant="outline"
              disabled={isGoogleLoading || isPending}
              leftIcon={
                <View className="absolute h-5 w-5 left-5">
                  <Image
                    className="h-5 w-5"
                    resizeMode="contain"
                    source={googleLogo}
                  />
                </View>
              }
              rightIcon={
                isGoogleLoading && (
                  <ActivityIndicator
                    className="absolute right-5"
                    color={foreground}
                  />
                )
              }
              onPress={handleGoogleSignUp}
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              disabled={isGoogleLoading || isPending}
              leftIcon={
                <View className="absolute h-6 w-5 left-5">
                  <FontAwesome color={foreground} name="apple" size={22} />
                </View>
              }
              onPress={() => alert("Apple Comming Soon")}
            >
              Continue with Apple
            </Button>
          </View>

          <View className="mt-auto flex-row items-center justify-center pt-10">
            <Text className="font-inter text-[13px] text-muted-foreground">
              Don&apos;t have an account?{" "}
            </Text>
            <Link href={signUpHref} asChild replace>
              <Pressable
                accessibilityLabel="Sign in to your account"
                className="-my-3 min-h-11 justify-center px-1"
              >
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </SafeAreaScreen>
  );
};

export default SignIn;
