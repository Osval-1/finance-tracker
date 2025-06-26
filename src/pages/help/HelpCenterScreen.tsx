import { useState } from "react";
import { Layout } from "@/components/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Users,
  Shield,
  CreditCard,
  BarChart3,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  ThumbsUp,
  Star,
  HelpCircle,
  Zap,
  Target,
  Settings,
  Book,
  Video,
  ChevronRight,
  Download,
  Globe,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  articleCount: number;
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  isPopular: boolean;
  lastUpdated: string;
  helpfulCount: number;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics and set up your account",
    icon: <Zap className="h-6 w-6" />,
    color: "from-blue-500 to-indigo-600",
    articleCount: 12,
  },
  {
    id: "accounts",
    title: "Managing Accounts",
    description: "Connect banks, add accounts, and sync data",
    icon: <CreditCard className="h-6 w-6" />,
    color: "from-green-500 to-emerald-600",
    articleCount: 8,
  },
  {
    id: "budgets",
    title: "Budgeting & Goals",
    description: "Create budgets, set goals, and track progress",
    icon: <Target className="h-6 w-6" />,
    color: "from-purple-500 to-violet-600",
    articleCount: 15,
  },
  {
    id: "reports",
    title: "Reports & Analytics",
    description: "Understand your spending and financial trends",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "from-orange-500 to-amber-600",
    articleCount: 10,
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Keep your financial data safe and secure",
    icon: <Shield className="h-6 w-6" />,
    color: "from-red-500 to-rose-600",
    articleCount: 6,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Fix common issues and sync problems",
    icon: <Settings className="h-6 w-6" />,
    color: "from-gray-500 to-slate-600",
    articleCount: 9,
  },
];

const popularArticles: HelpArticle[] = [
  {
    id: "1",
    title: "How to connect your bank account with Plaid",
    description: "Step-by-step guide to securely link your bank accounts",
    category: "accounts",
    readTime: "5 min read",
    isPopular: true,
    lastUpdated: "2 days ago",
    helpfulCount: 234,
  },
  {
    id: "2",
    title: "Setting up your first budget",
    description: "Learn how to create and manage budgets effectively",
    category: "budgets",
    readTime: "8 min read",
    isPopular: true,
    lastUpdated: "1 week ago",
    helpfulCount: 189,
  },
  {
    id: "3",
    title: "Understanding transaction categorization",
    description: "How automatic categorization works and how to customize it",
    category: "getting-started",
    readTime: "6 min read",
    isPopular: true,
    lastUpdated: "3 days ago",
    helpfulCount: 156,
  },
  {
    id: "4",
    title: "Importing transactions from CSV files",
    description: "Manual transaction import for banks not supported by Plaid",
    category: "accounts",
    readTime: "4 min read",
    isPopular: true,
    lastUpdated: "5 days ago",
    helpfulCount: 142,
  },
];

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Is my financial data secure?",
    answer:
      "Yes, we use bank-level encryption and security measures. We partner with Plaid for secure bank connections and never store your banking credentials. All data is encrypted both in transit and at rest.",
    category: "security",
  },
  {
    id: "2",
    question: "How often does my account data sync?",
    answer:
      "Account data syncs automatically every 4-24 hours depending on your settings. You can also manually sync at any time from the accounts page. Some banks may have faster or slower sync times.",
    category: "accounts",
  },
  {
    id: "3",
    question: "Can I use the app with multiple currencies?",
    answer:
      "Yes, FinanceTracker supports multiple currencies. You can set your base currency in settings and add accounts in different currencies. Exchange rates are updated daily for accurate conversions.",
    category: "getting-started",
  },
  {
    id: "4",
    question: "What happens if my bank isn't supported by Plaid?",
    answer:
      "You can manually add accounts and import transactions via CSV, OFX, or QIF files. You can also manually enter transactions. We're constantly working with Plaid to add support for more financial institutions.",
    category: "accounts",
  },
  {
    id: "5",
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from the billing section in your account settings. Your data will remain accessible for 30 days after cancellation, allowing you to export it if needed.",
    category: "troubleshooting",
  },
];

export default function HelpCenterScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = popularArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFAQs = faqs.filter(
    (faq) =>
      (selectedCategory ? faq.category === selectedCategory : true) &&
      (faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContactSubmit = () => {
    toast.success(
      "Your message has been sent! We'll get back to you within 24 hours."
    );
  };

  return (
    <Layout title="Help Center">
      {/* Background with gradient */}
      <div className="min-h-full bg-gradient-to-br from-cyan-50 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-purple-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Find answers, learn how to use FinanceTracker, and get the most
              out of your financial management.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for help articles, guides, and FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <Book className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">60+</div>
                <div className="text-sm text-gray-600">Help Articles</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <Video className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">25+</div>
                <div className="text-sm text-gray-600">Video Tutorials</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Community Members</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">&lt;2h</div>
                <div className="text-sm text-gray-600">Average Response</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="browse" className="space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
              <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2">
                <TabsTrigger
                  value="browse"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Browse Topics
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Popular Articles
                </TabsTrigger>
                <TabsTrigger
                  value="faq"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-xl transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Browse Topics Tab */}
            <TabsContent value="browse" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Browse Help Topics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {helpCategories.map((category) => (
                    <Card
                      key={category.id}
                      className="border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <CardContent className="p-6">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 text-white`}
                        >
                          {category.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {category.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="rounded-full">
                            {category.articleCount} articles
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 rounded-xl"
                  >
                    <Download className="h-5 w-5 mr-3 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Download User Guide</div>
                      <div className="text-sm text-gray-600">
                        Complete PDF manual
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 rounded-xl"
                  >
                    <Video className="h-5 w-5 mr-3 text-green-600" />
                    <div className="text-left">
                      <div className="font-medium">Video Tutorials</div>
                      <div className="text-sm text-gray-600">
                        Step-by-step guides
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start h-auto p-4 rounded-xl"
                  >
                    <Globe className="h-5 w-5 mr-3 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium">Community Forum</div>
                      <div className="text-sm text-gray-600">
                        Ask other users
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Popular Articles Tab */}
            <TabsContent value="popular" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Popular Articles
                </h2>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="border-0 shadow-sm bg-white/70 backdrop-blur-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {article.title}
                              </h3>
                              {article.isPopular && (
                                <Badge className="bg-yellow-100 text-yellow-800 rounded-full">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 mb-3">
                              {article.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{article.readTime}</span>
                              <span>•</span>
                              <span>Updated {article.lastUpdated}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{article.helpfulCount} helpful</span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>

                {/* Category Filter */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={
                        selectedCategory === null ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                      className="rounded-full"
                    >
                      All Categories
                    </Button>
                    {helpCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="rounded-full"
                      >
                        {category.title}
                      </Button>
                    ))}
                  </div>
                </div>

                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={faq.id}
                          className="border-b border-gray-200"
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-medium text-gray-900">
                              {faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 pt-2">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contact Support Tab */}
            <TabsContent value="contact" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Support
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Methods */}
                  <div className="space-y-6">
                    <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Live Chat
                            </h3>
                            <p className="text-sm text-gray-600">
                              Available 24/7
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Get instant help from our support team. Usually
                          responds within 5 minutes.
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl">
                          Start Live Chat
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Mail className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Email Support
                            </h3>
                            <p className="text-sm text-gray-600">
                              support@financetracker.com
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Send us an email and we'll get back to you within 24
                          hours.
                        </p>
                        <Button variant="outline" className="w-full rounded-xl">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Phone className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              Phone Support
                            </h3>
                            <p className="text-sm text-gray-600">
                              +1 (555) 123-4567
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          Call us Monday-Friday, 9 AM - 6 PM EST for immediate
                          assistance.
                        </p>
                        <Button variant="outline" className="w-full rounded-xl">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Contact Form */}
                  <div>
                    <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription>
                          Fill out the form below and we'll get back to you as
                          soon as possible.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input id="subject" placeholder="How can we help?" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Please describe your issue or question..."
                            rows={4}
                          />
                        </div>

                        <Button
                          onClick={handleContactSubmit}
                          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl"
                        >
                          Send Message
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-8">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 text-blue-100" />
                <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Our support team is here to help you get the most out of
                  FinanceTracker. Don't hesitate to reach out!
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="secondary"
                    className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600 rounded-xl"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
