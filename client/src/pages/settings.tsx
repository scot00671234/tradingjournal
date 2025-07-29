import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { updateProfileSchema, type UpdateProfileData, type BillingInfo } from "@shared/schema";
import { AlertTriangle, CreditCard, Settings, Trash2, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get current user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/user'],
  });

  // Get billing information
  const { data: billing, isLoading: billingLoading } = useQuery({
    queryKey: ['/api/billing'],
  });

  // Get subscription status
  const { data: subscription } = useQuery({
    queryKey: ['/api/subscription-status'],
  });

  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return await apiRequest("PUT", "/api/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  // Cancel subscription mutation
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/cancel-subscription");
    },
    onSuccess: () => {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will be cancelled at the end of the current billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/billing'] });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    },
  });

  // Reactivate subscription mutation
  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/reactivate-subscription");
    },
    onSuccess: () => {
      toast({
        title: "Subscription Reactivated",
        description: "Your subscription has been reactivated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/billing'] });
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-status'] });
    },
    onError: (error: any) => {
      toast({
        title: "Reactivation Failed",
        description: error.message || "Failed to reactivate subscription",
        variant: "destructive",
      });
    },
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", "/api/account");
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      // Redirect to home page
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateProfileData) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancelSubscription = () => {
    cancelSubscriptionMutation.mutate();
  };

  const handleReactivateSubscription = () => {
    reactivateSubscriptionMutation.mutate();
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
    setShowDeleteConfirm(false);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
            <div className="grid gap-6">
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        </div>

        <div className="grid gap-6">
          {/* Profile Settings */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-amber-600" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>
                Update your personal information and email address.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                  >
                    {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Billing & Subscription */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-amber-200 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <CardTitle>Billing & Subscription</CardTitle>
              </div>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Plan:</span>
                    <span className="capitalize text-amber-600 font-semibold">
                      {billing?.plan || subscription?.plan || 'Free'}
                    </span>
                  </div>
                  
                  {billing?.status && billing.status !== 'inactive' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Status:</span>
                        <span className={`capitalize font-semibold ${
                          billing.status === 'active' ? 'text-green-600' :
                          billing.status === 'cancel_at_period_end' ? 'text-orange-600' :
                          'text-red-600'
                        }`}>
                          {billing.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {billing.currentPeriodEnd && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {billing.cancelAtPeriodEnd ? 'Cancels on:' : 'Next billing:'}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(billing.currentPeriodEnd).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {billing.paymentMethod && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Payment method:</span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {billing.paymentMethod.brand.toUpperCase()} ****{billing.paymentMethod.last4}
                          </span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex space-x-3">
                        {billing.cancelAtPeriodEnd ? (
                          <Button
                            onClick={handleReactivateSubscription}
                            disabled={reactivateSubscriptionMutation.isPending}
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            {reactivateSubscriptionMutation.isPending ? "Reactivating..." : "Reactivate Subscription"}
                          </Button>
                        ) : (
                          <Button
                            onClick={handleCancelSubscription}
                            disabled={cancelSubscriptionMutation.isPending}
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                          >
                            {cancelSubscriptionMutation.isPending ? "Cancelling..." : "Cancel Subscription"}
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-red-200 dark:border-red-800">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
              </div>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account,
                      cancel any active subscriptions, and remove all of your trading data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={deleteAccountMutation.isPending}
                    >
                      {deleteAccountMutation.isPending ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}