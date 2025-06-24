import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function BudgetsList() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Budgets</h1>
          <p className="text-muted-foreground">
            Track and manage your spending limits across different categories
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$850.00</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$679.75</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$170.25</div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-8 text-center">
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">
            Budget Feature Coming Soon
          </h3>
          <p className="text-muted-foreground mb-4">
            We're working on implementing the full budget management feature.
            This will include budget creation, tracking, alerts, and detailed
            analytics.
          </p>
          <Button variant="outline">Learn More About Budgets</Button>
        </CardContent>
      </Card>
    </div>
  );
}
