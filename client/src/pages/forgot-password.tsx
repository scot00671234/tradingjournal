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
import { forgotPasswordSchema, type ForgotPasswordData } from "@shared/schema";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      return await apiRequest("POST", "/api/forgot-password", data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Reset Link Sent",
        description: "If an account with that email exists, we've sent a password reset link.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to send reset link",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPasswordMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-green-200 dark:border-green-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Check Your Email
            </CardTitle>
            <CardDescription>
              If an account with that email exists, we've sent you a password reset link.
              Please check your email and follow the instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Email sent!</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                The reset link will expire in 1 hour for security purposes.
              </p>
            </div>
            
            <Button
              onClick={() => setLocation('/login')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
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
            <Mail className="w-8 h-8 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Forgot Password?
          </CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="email" 
                        placeholder="Enter your email address"
                        className="bg-white dark:bg-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              >
                {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setLocation('/login')}
              className="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Back to login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}