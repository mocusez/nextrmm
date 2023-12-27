"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { signupDataSchema } from "~/lib/validation/auth";
import { api } from "~/trpc/react";
import { I18nDict } from "~/types";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  d: I18nDict;
}

type SignupFormData = z.infer<typeof signupDataSchema>;

export function SignUpForm({ className, d, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupDataSchema),
  });

  const addUser = api.user.addUser.useMutation({
    onMutate: async () => {
      setIsLoading(true);
    },
    onSuccess: async () => {
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      toast({
        title: d["sign-up-success-title"],
        description: d["sign-up-success-description"],
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsLoading(false);
      router.push("/dashboard");
    },
    onError: (error) => {
      setIsLoading(false);
      toast({
        variant: "destructive",
        description: d["sign-up-fail-title"],
      });
    },
  });

  async function onSubmit(data: SignupFormData) {
    await addUser.mutate({ email: data.email, password: data.password });
    setEmail(data.email);
    setPassword(data.password);
    return;
  }
  return (
    <div className={cn("grid gap-9", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">{d.email}</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{d["password"]}</Label>
            <Input
              id="password"
              placeholder="●●●●●●●●"
              type="password"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {d["sign-up"]}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {d.continue}
          </span>
        </div>
      </div>
      <div className="grid gap-6">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Icons.google className="mr-2 h-4 w-4" /> Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" /> GitHub
        </Button>
      </div>
    </div>
  );
}