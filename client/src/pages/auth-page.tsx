import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { z } from "zod";
import { TrendingUp, Shield, BarChart3, Target } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import coinFeedlyLogo from "@assets/logo coin feedly (1)_1753637229790.png";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginData = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("login");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  if (user) {
    return null;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = async (data: LoginData) => {
    try {
      await loginMutation.mutateAsync(data);
      setLocation("/dashboard");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const onRegister = async (data: InsertUser) => {
    try {
      await registerMutation.mutateAsync(data);
      setLocation("/dashboard");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex">
      {/* Left side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src={coinFeedlyLogo} 
                alt="CoinFeedly" 
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-light tracking-wider text-gray-900 dark:text-white">
                Coin<span className="font-medium ml-1">Feedly</span>
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Track your trades. Analyze your performance.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Sign in to your trading journal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Signing in..." : "Sign in"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create your account</CardTitle>
                  <CardDescription>
                    Start your trading journal today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 dark:bg-gray-900 p-8 flex-col justify-center">
        <div className="max-w-md">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Trading Journal
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Take your trading to the next level with detailed analytics, performance tracking, and insights designed for serious traders.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-slate-300">Advanced Analytics & Insights</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-slate-300">Risk Management Tools</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-slate-300">Secure & Private</span>
            </div>
          </div>
          

        </div>
      </div>
    </div>
  );
}
