import React, { useState } from "react";
import { Layout } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  User,
  Shield,
  Bell,
  RefreshCw,
  Palette,
  Code,
  Download,
  Trash2,
  Key,
  Copy,
  Save,
  AlertTriangle,
  Settings,
  Smartphone,
  Mail,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsOverviewScreen() {
  const [activeTab, setActiveTab] = useState("profile");
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [apiKeyGenerated, setApiKeyGenerated] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState("");
  const [notifications, setNotifications] = useState({
    budget: true,
    bills: true,
    transactions: true,
    goals: false,
    email: true,
    sms: false,
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully");
  };

  const handleChangePassword = () => {
    toast.success("Password changed successfully");
  };

  const handleGenerateApiKey = () => {
    const newKey =
      "ft_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setGeneratedApiKey(newKey);
    setApiKeyGenerated(true);
    toast.success("API key generated successfully");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(generatedApiKey);
    toast.success("API key copied to clipboard");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion initiated - confirmation email sent");
  };

  return (
    <Layout title="Settings">
      {/* Background with gradient */}
      <div className="min-h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-cyan-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              Settings & Preferences
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account settings, security preferences, and
              personalization options.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <TabsList className="grid w-full grid-cols-6 bg-transparent gap-2">
                <TabsTrigger
                  value="profile"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger
                  value="data"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Data</span>
                </TabsTrigger>
                <TabsTrigger
                  value="theme"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Palette className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Theme</span>
                </TabsTrigger>
                <TabsTrigger
                  value="developer"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Code className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Developer</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Sarah" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Wilson" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="sarah.wilson@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Select defaultValue="america-new_york">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america-new_york">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="america-chicago">
                            Central Time (CT)
                          </SelectItem>
                          <SelectItem value="america-denver">
                            Mountain Time (MT)
                          </SelectItem>
                          <SelectItem value="america-los_angeles">
                            Pacific Time (PT)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Preferred Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD - US Dollar</SelectItem>
                          <SelectItem value="eur">EUR - Euro</SelectItem>
                          <SelectItem value="gbp">
                            GBP - British Pound
                          </SelectItem>
                          <SelectItem value="cad">
                            CAD - Canadian Dollar
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select defaultValue="mm-dd-yyyy">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Change Password */}
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-blue-600" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Multi-Factor Authentication */}
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                      Multi-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">MFA Status</p>
                        <p className="text-sm text-gray-600">
                          {mfaEnabled
                            ? "Multi-factor authentication is enabled"
                            : "Multi-factor authentication is disabled"}
                        </p>
                      </div>
                      <Badge
                        variant={mfaEnabled ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {mfaEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="mfa-toggle"
                          checked={mfaEnabled}
                          onCheckedChange={setMfaEnabled}
                        />
                        <Label htmlFor="mfa-toggle">Enable MFA</Label>
                      </div>
                      {mfaEnabled && (
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl"
                          >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Configure Authenticator App
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full rounded-xl"
                          >
                            <Smartphone className="h-4 w-4 mr-2" />
                            Setup SMS Backup
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Danger Zone */}
              <Card className="border-red-200 shadow-sm bg-red-50/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-600">
                    These actions cannot be undone. Please proceed with caution.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download My Data
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="rounded-xl">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove all your data from
                            our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-xl">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about important events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Notification Types */}
                  <div className="space-y-6">
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                          <p className="font-medium">Budget Threshold Alerts</p>
                          <p className="text-sm text-gray-600">
                            Get notified when you approach budget limits
                          </p>
                        </div>
                        <Switch
                          checked={notifications.budget}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              budget: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                          <p className="font-medium">Bill Reminders</p>
                          <p className="text-sm text-gray-600">
                            Reminders for upcoming bills and payments
                          </p>
                        </div>
                        <Switch
                          checked={notifications.bills}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              bills: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                          <p className="font-medium">
                            Large Transaction Alerts
                          </p>
                          <p className="text-sm text-gray-600">
                            Alerts for transactions over a certain amount
                          </p>
                        </div>
                        <Switch
                          checked={notifications.transactions}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              transactions: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                          <p className="font-medium">Goal Milestones</p>
                          <p className="text-sm text-gray-600">
                            Celebrate when you reach savings goals
                          </p>
                        </div>
                        <Switch
                          checked={notifications.goals}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              goals: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Delivery Methods */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Delivery Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-600">
                              sarah.wilson@example.com
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              email: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-gray-600">
                              +1 (555) 123-4567
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              sms: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Refresh Tab */}
            <TabsContent value="data" className="space-y-6">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                    Data Refresh Settings
                  </CardTitle>
                  <CardDescription>
                    Control how often your financial data is synchronized
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Automatic Sync Frequency</h3>
                    <RadioGroup defaultValue="auto-4h" className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                        <RadioGroupItem value="auto-4h" id="auto-4h" />
                        <Label htmlFor="auto-4h" className="flex-1">
                          <div>
                            <p className="font-medium">Every 4 hours</p>
                            <p className="text-sm text-gray-600">
                              Recommended for active traders
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                        <RadioGroupItem value="auto-24h" id="auto-24h" />
                        <Label htmlFor="auto-24h" className="flex-1">
                          <div>
                            <p className="font-medium">Daily</p>
                            <p className="text-sm text-gray-600">
                              Good for most users
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual" className="flex-1">
                          <div>
                            <p className="font-medium">Manual only</p>
                            <p className="text-sm text-gray-600">
                              Sync only when you request it
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Last Sync</h3>
                        <p className="text-sm text-gray-600">2 hours ago</p>
                      </div>
                      <Button variant="outline" className="rounded-xl">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                    </div>
                  </div>

                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                    <Save className="h-4 w-4 mr-2" />
                    Save Sync Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme & Accessibility Tab */}
            <TabsContent value="theme" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-blue-600" />
                      Appearance
                    </CardTitle>
                    <CardDescription>
                      Customize how the app looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Theme</h3>
                      <RadioGroup defaultValue="light" className="space-y-3">
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                          <RadioGroupItem value="light" id="light" />
                          <Label
                            htmlFor="light"
                            className="flex items-center gap-3 flex-1"
                          >
                            <Sun className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Light Mode</p>
                              <p className="text-sm text-gray-600">
                                Clean and bright interface
                              </p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                          <RadioGroupItem value="dark" id="dark" />
                          <Label
                            htmlFor="dark"
                            className="flex items-center gap-3 flex-1"
                          >
                            <Moon className="h-4 w-4" />
                            <div>
                              <p className="font-medium">Dark Mode</p>
                              <p className="text-sm text-gray-600">
                                Easy on the eyes
                              </p>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                          <RadioGroupItem value="system" id="system" />
                          <Label
                            htmlFor="system"
                            className="flex items-center gap-3 flex-1"
                          >
                            <Monitor className="h-4 w-4" />
                            <div>
                              <p className="font-medium">System</p>
                              <p className="text-sm text-gray-600">
                                Match your device settings
                              </p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="font-medium">Font Size</h3>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Accessibility
                    </CardTitle>
                    <CardDescription>
                      Options to improve usability for everyone
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                          <p className="font-medium">High Contrast Mode</p>
                          <p className="text-sm text-gray-600">
                            Increases contrast for better visibility
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                          <p className="font-medium">Reduce Motion</p>
                          <p className="text-sm text-gray-600">
                            Minimize animations and transitions
                          </p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="space-y-1">
                          <p className="font-medium">Screen Reader Support</p>
                          <p className="text-sm text-gray-600">
                            Enhanced accessibility features
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                <Save className="h-4 w-4 mr-2" />
                Save Appearance Settings
              </Button>
            </TabsContent>

            {/* Developer/API Tab */}
            <TabsContent value="developer" className="space-y-6">
              <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-600" />
                    Developer Settings
                  </CardTitle>
                  <CardDescription>
                    Manage API keys and developer tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">API Keys</h3>
                    <div className="space-y-4">
                      {/* Existing API Keys */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">Production API Key</p>
                            <p className="text-sm text-gray-600">
                              Created on March 15, 2024
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                          >
                            Revoke
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-gray-200 px-2 py-1 rounded flex-1">
                            ft_prod_••••••••••••••••••••••••••••
                          </code>
                          <Button variant="ghost" size="sm" className="p-2">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Generated API Key */}
                      {apiKeyGenerated && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-green-800">
                                New API Key Generated
                              </p>
                              <p className="text-sm text-green-600">
                                Make sure to copy it now. You won't be able to
                                see it again!
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-green-100 px-2 py-1 rounded flex-1 text-green-800">
                              {generatedApiKey}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-green-700 hover:text-green-800"
                              onClick={handleCopyApiKey}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleGenerateApiKey}
                        variant="outline"
                        className="w-full rounded-xl"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Generate New API Key
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">API Documentation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="justify-start rounded-xl"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        View API Docs
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start rounded-xl"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Postman Collection
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Rate Limits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-blue-600">
                          1,000
                        </p>
                        <p className="text-sm text-gray-600">
                          Requests per hour
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-green-600">156</p>
                        <p className="text-sm text-gray-600">Used this hour</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <p className="text-2xl font-bold text-gray-600">844</p>
                        <p className="text-sm text-gray-600">Remaining</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
