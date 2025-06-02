import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router";
import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { usePasswordReset } from "@/hooks/auth/usePasswordReset";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/schema/auth";

export default function PasswordRecoveryScreen() {
  const { forgotPassword, isForgotPasswordLoading, forgotPasswordSuccess } =
    usePasswordReset();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

  if (forgotPasswordSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white rounded-2xl shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              If an account exists for this email, we've sent a reset link to
              your inbox.
            </p>
            <Link
              to="/auth/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Sign In
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold mb-4">
            Forgot Your Password?
          </CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="bg-blue-600 text-white rounded-xl w-full py-2 hover:bg-blue-700 transition-all transform hover:scale-[0.98]"
              disabled={isForgotPasswordLoading}
            >
              {isForgotPasswordLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                to="/auth/login"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
