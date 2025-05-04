"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNFT } from "@/contexts/NFTContext";
import { useToast } from "@/hooks/use-toast";
import {
  Award,
  Clock,
  Star,
  Check,
  Sparkles,
  Compass,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export default function Rewards() {
  const { tasks } = useNFT();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);
  const [claimingTask, setClaimingTask] = useState<string | null>(null);

  const shopTasks = tasks.filter((task) => task.type === "shop");
  const platformTasks = tasks.filter((task) => task.type === "platform");
  const eventTasks = tasks.filter((task) => task.type === "event");

  const filteredTasks =
    activeTab === "all"
      ? tasks
      : tasks.filter((task) => task.type === activeTab);

  const handleClaimReward = (taskId: string) => {
    setClaimingTask(taskId);

    setTimeout(() => {
      setClaimedTasks((prev) => [...prev, taskId]);
      setClaimingTask(null);

      toast({
        title: "Reward Claimed!",
        description: "Your reward has been added to your account.",
      });
    }, 1500);
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case "shop":
        return <Compass className="h-5 w-5" />;
      case "platform":
        return <Star className="h-5 w-5" />;
      case "event":
        return <Zap className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case "shop":
        return "Shop Task";
      case "platform":
        return "Platform Challenge";
      case "event":
        return "Limited-Time Event";
      default:
        return "Task";
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "shop":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "platform":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "event":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-gray-300";
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Rewards Center
        </h1>

        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-lg">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-amber-800">Your Points</p>
            <p className="text-xl font-bold text-amber-900">120</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="shop"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Shops ({shopTasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="platform"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Platform ({platformTasks.length})
            </TabsTrigger>
            <TabsTrigger
              value="event"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              Events ({eventTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map((task, index) => {
                const isCompleted = task.progress >= 100;
                const isClaimed = claimedTasks.includes(task.id);
                const isClaimable = isCompleted && !isClaimed;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card
                      className={`p-5 hover:shadow-md transition-all ${
                        isClaimed ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`p-3 rounded-full ${
                            task.type === "shop"
                              ? "bg-amber-50"
                              : task.type === "platform"
                              ? "bg-purple-50"
                              : "bg-orange-50"
                          }`}
                          whileHover={{ rotate: 10 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                        >
                          {getTaskIcon(task.type)}
                        </motion.div>

                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3
                                className={`font-semibold text-lg ${
                                  isClaimed ? "text-gray-500" : ""
                                }`}
                              >
                                {task.title}
                                {isClaimed && (
                                  <span className="ml-2 inline-flex items-center text-green-600 text-sm">
                                    <Check className="h-3 w-3 mr-1" />
                                    Claimed
                                  </span>
                                )}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getBadgeColor(task.type)}>
                                  {getTaskTypeLabel(task.type)}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {task.shopName}
                                </span>
                              </div>
                            </div>
                            {task.expiresAt && (
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires:{" "}
                                {new Date(task.expiresAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          <p
                            className={`text-gray-600 text-sm ${
                              isClaimed ? "text-gray-400" : ""
                            }`}
                          >
                            {task.description}
                          </p>

                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span
                                className={isClaimed ? "text-gray-400" : ""}
                              >
                                Progress
                              </span>
                              <span
                                className={isClaimed ? "text-gray-400" : ""}
                              >
                                {task.progress}%
                              </span>
                            </div>
                            <Progress
                              value={task.progress}
                              className={`h-2 ${
                                isClaimed
                                  ? "bg-gray-300"
                                  : getProgressColor(task.progress)
                              }`}
                            />
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div
                              className={`flex items-center gap-1 text-sm ${
                                isClaimed ? "text-gray-400" : "text-amber-600"
                              }`}
                            >
                              <Star className="h-4 w-4" />
                              <span>Reward: {task.reward}</span>
                            </div>

                            <Button
                              size="sm"
                              disabled={
                                !isClaimable || claimingTask === task.id
                              }
                              onClick={() => handleClaimReward(task.id)}
                              className={`gap-1 ${
                                isClaimed
                                  ? "bg-gray-100 text-gray-400 hover:bg-gray-100"
                                  : claimingTask === task.id
                                  ? "bg-amber-500 hover:bg-amber-600"
                                  : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                              }`}
                            >
                              {claimingTask === task.id ? (
                                <>
                                  <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                                  Claiming...
                                </>
                              ) : isClaimed ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Claimed
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3 w-3" />
                                  Claim Reward
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <motion.div
                className="text-center py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex rounded-full bg-amber-100 p-3 mb-4">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No tasks found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  There are no {activeTab === "all" ? "" : activeTab} tasks
                  available right now. Check back soon!
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 shadow-inner"
      >
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="h-5 w-5 text-amber-600 mr-2" />
          <p className="text-amber-800 font-medium">Upcoming Rewards</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border-amber-200 bg-white/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">250 Points</h4>
                <p className="text-xs text-gray-500">Free Coffee Voucher</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-amber-200 bg-white/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">500 Points</h4>
                <p className="text-xs text-gray-500">Exclusive NFT Drop</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-amber-200 bg-white/80">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">1000 Points</h4>
                <p className="text-xs text-gray-500">VIP Shop Access</p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
