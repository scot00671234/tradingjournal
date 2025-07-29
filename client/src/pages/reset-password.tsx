import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { resetPasswordSchema, type ResetPasswordData } from "@shared/schema";
import { Key, CheckCircle, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  // Get token from URL params
  const token = new URLSearchParams(window.location.search).get('token') || '';

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      return await apiRequest("POST", "/api/reset-password", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResetPasswordData) => {
    resetPasswordMutation.mutate(data);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-600">Invalid Reset Link</CardTitle>
            <CardDescription>
              The password reset link is missing or invalid. Please request a new password reset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setLocation('/forgot-password')}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
            >
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Password Reset Successful!
            </CardTitle>
            <CardDescription>
              Your password has been successfully reset. You can now log in with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setLocation('/login')}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
            >
              Continue to Login
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Key className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it's at least 8 characters long.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        placeholder="Enter your new password"
                        className="bg-white dark:bg-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              >
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setLocation('/login')}
              className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              Remember your password? Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}