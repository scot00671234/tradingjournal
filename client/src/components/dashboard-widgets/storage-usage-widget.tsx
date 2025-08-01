import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HardDrive, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SubscriptionStatus } from "@shared/schema";

export function StorageUsageWidget() {
  const { data: subscriptionStatus, isLoading } = useQuery<SubscriptionStatus>({
    queryKey: ['/api/subscription-status']
  });

  if (isLoading) {
    return (
      <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Usage</CardTitle>
            <HardDrive className="w-4 h-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscriptionStatus) {
    return null;
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const usagePercentage = Math.min((subscriptionStatus.storageUsedBytes / subscriptionStatus.storageLimit) * 100, 100);
  const isNearLimit = usagePercentage > 80;
  const isAtLimit = usagePercentage >= 100;

  return (
    <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg glass-transition hover:shadow-xl hover:scale-105">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Usage</CardTitle>
          <div className="flex items-center space-x-1">
            {isAtLimit && <AlertTriangle className="w-4 h-4 text-red-500" />}
            <HardDrive className={`w-4 h-4 ${isAtLimit ? 'text-red-500' : isNearLimit ? 'text-yellow-500' : 'text-blue-500'}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatFileSize(subscriptionStatus.storageUsedBytes)}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            of {formatFileSize(subscriptionStatus.storageLimit)} used
          </div>
        </div>
        
        <Progress 
          value={usagePercentage} 
          className={`h-2 ${isAtLimit ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-yellow-500' : '[&>div]:bg-blue-500'}`}
        />
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{usagePercentage.toFixed(1)}% used</span>
          <span className={`capitalize font-medium ${
            subscriptionStatus.plan === 'free' ? 'text-gray-600' :
            subscriptionStatus.plan === 'pro' ? 'text-blue-600' :
            subscriptionStatus.plan === 'elite' ? 'text-purple-600' :
            subscriptionStatus.plan === 'diamond' ? 'text-cyan-600' :
            'text-yellow-600'
          }`}>
            {subscriptionStatus.plan} plan
          </span>
        </div>

        {isAtLimit && (
          <div className="text-xs text-red-600 dark:text-red-400 font-medium">
            Storage limit reached. Upgrade plan to add more images.
          </div>
        )}
        {isNearLimit && !isAtLimit && (
          <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
            Storage nearly full. Consider upgrading your plan.
          </div>
        )}
      </CardContent>
    </Card>
  );
}