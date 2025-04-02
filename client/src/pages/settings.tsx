import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';
import { Loader2, UserCircle, Bell, Globe, Shield, CreditCard, Youtube } from 'lucide-react';

// Form validation schemas
const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  username: z.string().min(3, "Username must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  avatar: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Password must be at least 6 characters."),
  newPassword: z.string().min(6, "Password must be at least 6 characters."),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters."),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form setup
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    },
  });
  
  // Password form setup
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Account appearance settings
  const [theme, setTheme] = useState("light");
  
  // YouTube connection status
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  
  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const response = await apiRequest('PATCH', `/api/users/${user?.id}`, values);
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
  
  // Password update mutation
  const updatePasswordMutation = useMutation({
    mutationFn: async (values: PasswordFormValues) => {
      const response = await apiRequest('PATCH', `/api/auth/password`, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Password updated successfully!");
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update password: ${error.message}`);
    },
  });
  
  // YouTube connection mutation
  const connectYouTubeMutation = useMutation({
    mutationFn: async () => {
      // This would be replaced with actual YouTube OAuth flow
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });
    },
    onSuccess: () => {
      setIsYouTubeConnected(true);
      toast.success("YouTube account connected successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to connect YouTube account: ${error.message}`);
    },
  });
  
  const onProfileSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };
  
  const onPasswordSubmit = (values: PasswordFormValues) => {
    updatePasswordMutation.mutate(values);
  };
  
  const handleConnectYouTube = () => {
    connectYouTubeMutation.mutate();
  };
  
  const handleDisconnectYouTube = () => {
    setIsYouTubeConnected(false);
    toast.success("YouTube account disconnected successfully!");
  };
  
  return (
    <AppLayout title="Settings" showCreateButton={false}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              <span className="hidden md:inline">Connections</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Billing</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage how your profile information appears to others.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={profileForm.watch("avatar")} alt={user?.name || user?.username} />
                          <AvatarFallback className="text-lg">
                            {user?.name?.charAt(0) || user?.username?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your full name as it will appear on your profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="username" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your unique username for Shortify.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" type="email" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your email address for account notifications.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="pt-6">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input placeholder="••••••••" type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updatePasswordMutation.isPending}
                      >
                        {updatePasswordMutation.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how Shortify looks for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="theme-selector" className="font-medium">Theme</Label>
                      <p className="text-sm text-slate-500">Select your preferred theme</p>
                    </div>
                    <select 
                      id="theme-selector" 
                      className="border border-slate-300 rounded-md px-2 py-1"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Manage how you receive notifications from Shortify.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Notifications</h3>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-marketing" className="font-medium">Marketing</Label>
                      <p className="text-sm text-slate-500">Receive emails about new features and updates</p>
                    </div>
                    <Switch 
                      id="email-marketing" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-social" className="font-medium">Video Updates</Label>
                      <p className="text-sm text-slate-500">Get notified when your videos receive engagement</p>
                    </div>
                    <Switch 
                      id="email-social" 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications} 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Push Notifications</h3>
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-all" className="font-medium">All Notifications</Label>
                      <p className="text-sm text-slate-500">Enable or disable all push notifications</p>
                    </div>
                    <Switch 
                      id="push-all" 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-videos" className="font-medium">Video Updates</Label>
                      <p className="text-sm text-slate-500">Get notified about video processing and publishing</p>
                    </div>
                    <Switch 
                      id="push-videos" 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button>Save Notification Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="connections" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Manage your connected service accounts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Youtube className="h-8 w-8 text-red-600" />
                    <div>
                      <h3 className="font-medium">YouTube</h3>
                      <p className="text-sm text-slate-500">Connect to upload videos directly to YouTube</p>
                    </div>
                  </div>
                  
                  {isYouTubeConnected ? (
                    <div className="flex items-center gap-4">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
                      <Button variant="outline" size="sm" onClick={handleDisconnectYouTube}>
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleConnectYouTube}
                      disabled={connectYouTubeMutation.isPending}
                    >
                      {connectYouTubeMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Connect YouTube
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>
                  Manage your subscription and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium">Free Plan</h3>
                      <p className="text-sm text-slate-500">Basic features with limited usage</p>
                    </div>
                    <Badge>Current Plan</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm">3 videos per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm">Basic templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm">Standard video quality</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium text-primary">Pro Plan</h3>
                      <p className="text-sm text-slate-600">Advanced features for serious creators</p>
                    </div>
                    <span className="font-medium">$19.99/month</span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm">Unlimited videos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm">Premium templates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm">4K video quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                  </div>
                  
                  <Button className="w-full">Upgrade to Pro</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
