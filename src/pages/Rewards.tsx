
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNFT } from "@/contexts/NFTContext";
import { useToast } from "@/hooks/use-toast";
import { Award, Clock, Star, Check } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Rewards() {
  const { tasks } = useNFT();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const shopTasks = tasks.filter(task => task.type === 'shop');
  const platformTasks = tasks.filter(task => task.type === 'platform');
  const eventTasks = tasks.filter(task => task.type === 'event');
  
  const filteredTasks = activeTab === 'all' 
    ? tasks 
    : tasks.filter(task => task.type === activeTab);

  const handleClaimReward = (taskId: string) => {
    toast({
      title: "Reward Claimed!",
      description: "Your reward has been added to your account.",
    });
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'shop':
        return <Award className="h-5 w-5" />;
      case 'platform':
        return <Star className="h-5 w-5" />;
      case 'event':
        return <Clock className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'shop': return 'Shop Task';
      case 'platform': return 'Platform Challenge';
      case 'event': return 'Limited-Time Event';
      default: return 'Task';
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'shop': return 'bg-blue-100 text-blue-800';
      case 'platform': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Rewards Center</h1>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">
            All ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="shop">
            Shops ({shopTasks.length})
          </TabsTrigger>
          <TabsTrigger value="platform">
            Platform ({platformTasks.length})
          </TabsTrigger>
          <TabsTrigger value="event">
            Events ({eventTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  task.type === 'shop' ? 'bg-blue-50' : 
                  task.type === 'platform' ? 'bg-purple-50' : 'bg-amber-50'
                }`}>
                  {getTaskIcon(task.type)}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getBadgeColor(task.type)}>
                          {getTaskTypeLabel(task.type)}
                        </Badge>
                        <span className="text-xs text-gray-500">{task.shopName}</span>
                      </div>
                    </div>
                    {task.expiresAt && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Expires: {new Date(task.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm">{task.description}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-1 text-sm text-violet-700">
                      <Star className="h-4 w-4" />
                      <span>Reward: {task.reward}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      disabled={task.progress < 100}
                      onClick={() => handleClaimReward(task.id)}
                      className="gap-1"
                    >
                      {task.progress >= 100 ? (
                        <>
                          <Check className="h-3 w-3" />
                          Claim Reward
                        </>
                      ) : (
                        'In Progress'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-10">
              <div className="inline-flex rounded-full bg-gray-100 p-3 mb-4">
                <Award className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="text-gray-500 max-w-md mx-auto mt-2">
                There are no {activeTab === 'all' ? '' : activeTab} tasks available right now. Check back soon!
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
