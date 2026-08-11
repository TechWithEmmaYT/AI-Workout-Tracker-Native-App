import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import {
  getOnboardingAnswers,
  resetOnboardingAnswers,
} from "@/constants/onboarding";
import { authClient } from "@/lib/auth-client";
import {
  SignUpFormValues,
  signUpSchema,
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

const SignUp = () => {
  const router = useRouter();
  const foreground = useAppThemeColor("foreground");
  const iconColor = useAppThemeColor("mutedForeground");
  const primaryForeground = useAppThemeColor("primaryForeground");
  const [isPending, setIsPending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(signUpSchema),
    shouldFocusError: false,
  });

  const onSubmit = handleSubmit(async ({ email, fullName, password }) => {
    const result = getOnboardingAnswers();
    if (!result.success) {
      router.replace("/welcome");
      return;
    }
    setIsPending(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        name: fullName,
        password,
        ...result.data,
      });
      if (error) {
        Alert.alert("Could not create account", error.message);
        return;
      }
      resetOnboardingAnswers();
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
              Create account
            </Text>
            <Text className="mt-1 font-inter text-[14px] leading-5 text-muted-foreground">
              Sign up to get started
            </Text>
          </View>

          <View className="mt-9 gap-5">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { value, onBlur, onChange } }) => (
                <View className="gap-2">
                  <Text className="font-inter-medium text-[14px] text-foreground">
                    Full Name
                  </Text>
                  <TextInput
                    textContentType="name"
                    autoComplete="name"
                    autoCapitalize="words"
                    value={value}
                    className={`h-14 rounded-xl border bg-input px-4 font-inter text-[14px] text-foreground ${errors.fullName ? "border-destructive" : "border-input-border"}`}
                    placeholder="John Doe"
                    placeholderTextColor={iconColor}
                    selectionColor={foreground}
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                  {errors.fullName && (
                    <Text className="font-inter text-[12px] text-destructive">
                      {errors.fullName.message}
                    </Text>
                  )}
                </View>
              )}
            />
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
          </View>

          <Button
            className="mt-10"
            disabled={isPending || isGoogleLoading}
            isLoading={isPending}
            onPress={onSubmit}
          >
            Sign Up
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
              Already have an account?{" "}
            </Text>
            <Link href="/sign-in" asChild replace>
              <Pressable
                accessibilityLabel="Sign in to your account"
                className="-my-3 min-h-11 justify-center px-1"
              >
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Sign In
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

export default SignUp;
