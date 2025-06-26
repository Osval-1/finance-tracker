import { Layout } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoalsList() {
  return (
    <Layout title="Goals">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Financial Goals
                </h1>
                <p className="text-gray-600">
                  Track and manage your financial objectives
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Goals Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Goals Feature In Development
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We're working on a comprehensive goals tracking system to help
                  you achieve your financial objectives.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Set savings goals with target amounts and deadlines</p>
                  <p>• Track progress with visual indicators</p>
                  <p>• Get milestone notifications and achievements</p>
                  <p>• Connect goals to your budgets and accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
