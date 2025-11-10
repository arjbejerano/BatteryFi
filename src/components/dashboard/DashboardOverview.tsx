import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Battery, 
  Zap, 
  TrendingUp, 
  Shield, 
  Coins, 
  Users,
  Activity,
  Thermometer,
  Wifi,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Gauge } from 'recharts';

// Mock data for demonstration
const batteryData = [
  { time: '00:00', soc: 45, exported: 2.3, imported: 1.8, demand: 8.5, renewable: 12.2 },
  { time: '04:00', soc: 52, exported: 1.9, imported: 2.1, demand: 6.2, renewable: 8.7 },
  { time: '08:00', soc: 68, exported: 4.2, imported: 0.8, demand: 12.3, renewable: 18.5 },
  { time: '12:00', soc: 85, exported: 8.1, imported: 0.2, demand: 15.7, renewable: 25.3 },
  { time: '16:00', soc: 78, exported: 6.7, imported: 1.2, demand: 18.2, renewable: 22.1 },
  { time: '20:00', soc: 62, exported: 3.4, imported: 2.8, demand: 14.6, renewable: 8.9 },
];

const rewardData = [
  { month: 'Jan', rewards: 245, contribution: 89 },
  { month: 'Feb', rewards: 312, contribution: 95 },
  { month: 'Mar', rewards: 289, contribution: 87 },
  { month: 'Apr', rewards: 378, contribution: 102 },
  { month: 'May', rewards: 425, contribution: 118 },
  { month: 'Jun', rewards: 398, contribution: 108 },
];

const energyAllocation = [
  { name: 'Home Consumption', value: 45, color: '#3b82f6' },
  { name: 'Grid Export', value: 30, color: '#10b981' },
  { name: 'Battery Storage', value: 20, color: '#f59e0b' },
  { name: 'Emergency Reserve', value: 5, color: '#ef4444' },
];

const communityHeatMap = [
  { area: 'Downtown', usage: 85, efficiency: 92 },
  { area: 'Suburbs', usage: 67, efficiency: 88 },
  { area: 'Industrial', usage: 95, efficiency: 78 },
  { area: 'Residential', usage: 72, efficiency: 91 },
];

interface DashboardOverviewProps {
  userProfile?: any;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ userProfile }) => {
  const [currentSoC, setCurrentSoC] = useState(72);
  const [batteryHealth, setBatteryHealth] = useState(94);
  const [totalRewards, setTotalRewards] = useState(2847.5);
  const [energyContribution, setEnergyContribution] = useState(1247);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSoC(prev => Math.max(20, Math.min(100, prev + (Math.random() - 0.5) * 2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSoCColor = (soc: number) => {
    if (soc >= 70) return 'hsl(var(--energy-high))';
    if (soc >= 40) return 'hsl(var(--energy-medium))';
    if (soc >= 20) return 'hsl(var(--energy-low))';
    return 'hsl(var(--energy-critical))';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery SoC</CardTitle>
            <Battery className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSoC.toFixed(1)}%</div>
            <Progress value={currentSoC} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              <span className="text-green-600">+2.3%</span> from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BATT Tokens</CardTitle>
            <Coins className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRewards.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+127.5</span> earned today
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{energyContribution}</div>
            <p className="text-xs text-muted-foreground">
              Grid stabilization points
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Health</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batteryHealth}%</div>
            <Progress value={batteryHealth} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Excellent condition
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="energy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="energy">Energy Flow</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Energy Trends Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Trends (24h)</CardTitle>
                <CardDescription>Battery SoC and energy flow over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={batteryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="soc" stroke="#3b82f6" strokeWidth={2} name="SoC %" />
                    <Line type="monotone" dataKey="renewable" stroke="#10b981" strokeWidth={2} name="Renewable kWh" />
                    <Line type="monotone" dataKey="demand" stroke="#f59e0b" strokeWidth={2} name="Demand kWh" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Energy Allocation Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Allocation</CardTitle>
                <CardDescription>How your energy is distributed</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={energyAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {energyAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {energyAllocation.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Optimization Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Edge AI Optimization</span>
              </CardTitle>
              <CardDescription>Real-time AI decision making and verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Model Confidence</span>
                    <Badge variant="secondary">94.2%</Badge>
                  </div>
                  <Progress value={94.2} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Optimization Actions</span>
                    <Badge variant="outline">47 today</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Last action: Charge optimization at 14:23</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verification Status</span>
                    <Badge className="bg-green-500">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">HMAC signature valid</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Rewards Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Rewards</CardTitle>
                <CardDescription>BATT tokens earned over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rewardData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rewards" fill="#3b82f6" name="BATT Rewards" />
                    <Bar dataKey="contribution" fill="#10b981" name="Contribution Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Reward Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Reward Breakdown</CardTitle>
                <CardDescription>Sources of your BATT tokens</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Grid Stabilization</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={75} className="w-20" />
                    <span className="text-sm font-medium">1,847 BATT</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Energy Sharing</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={60} className="w-20" />
                    <span className="text-sm font-medium">623 BATT</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Peak Demand Response</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={45} className="w-20" />
                    <span className="text-sm font-medium">287 BATT</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Community Participation</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={30} className="w-20" />
                    <span className="text-sm font-medium">90 BATT</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          {/* Community Heat Map */}
          <Card>
            <CardHeader>
              <CardTitle>Community Energy Usage</CardTitle>
              <CardDescription>Energy efficiency across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {communityHeatMap.map((area, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{area.area}</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Usage</span>
                        <span>{area.usage}%</span>
                      </div>
                      <Progress value={area.usage} />
                      <div className="flex items-center justify-between text-sm">
                        <span>Efficiency</span>
                        <span>{area.efficiency}%</span>
                      </div>
                      <Progress value={area.efficiency} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          {/* Device Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Battery className="h-5 w-5" />
                  <span>Home Battery</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-500">
                    <Wifi className="h-3 w-3 mr-1" />
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Capacity</span>
                  <span className="text-sm font-medium">13.5 kWh</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Temperature</span>
                  <div className="flex items-center space-x-1">
                    <Thermometer className="h-3 w-3" />
                    <span className="text-sm font-medium">24°C</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Ping</span>
                  <span className="text-sm text-muted-foreground">2 min ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Solar System</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-500">
                    <Wifi className="h-3 w-3 mr-1" />
                    Generating
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Capacity</span>
                  <span className="text-sm font-medium">8.2 kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Current Output</span>
                  <span className="text-sm font-medium">6.7 kW</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today's Generation</span>
                  <span className="text-sm text-green-600">47.3 kWh</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Edge Gateway</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-500">
                    <Wifi className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Model</span>
                  <span className="text-sm font-medium">v2.1.3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm font-medium">15d 7h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Verified</span>
                  <span className="text-sm text-green-600">99.7%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};