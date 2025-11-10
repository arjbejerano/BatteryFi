import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  MapPin, 
  Clock, 
  Coins,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface CommunityPool {
  id: string;
  pool_name: string;
  description: string;
  location_area: string;
  total_staked_tokens: number;
  total_participants: number;
  apy_rate: number;
  min_stake_amount: number;
  pool_type: string;
  is_active: boolean;
}

interface UserStake {
  id: string;
  pool_id: string;
  staked_amount: number;
  rewards_earned: number;
  stake_date: string;
  is_active: boolean;
}

export const CommunityPools: React.FC = () => {
  const [pools, setPools] = useState<CommunityPool[]>([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedPool, setSelectedPool] = useState<CommunityPool | null>(null);
  const [userTokenBalance, setUserTokenBalance] = useState(2847.5); // Mock balance
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchPools();
    if (user) {
      fetchUserStakes();
    }
  }, [user]);

  const fetchPools = async () => {
    try {
      const { data, error } = await supabase
        .from('community_pools_2025_10_22_14_48')
        .select('*')
        .eq('is_active', true)
        .order('total_staked_tokens', { ascending: false });

      if (error) throw error;
      setPools(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Pools",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStakes = async () => {
    if (!user) return;

    try {
      const { data: userData } = await supabase
        .from('users_2025_10_22_14_48')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (userData) {
        const { data, error } = await supabase
          .from('pool_stakes_2025_10_22_14_48')
          .select('*')
          .eq('user_id', userData.id)
          .eq('is_active', true);

        if (error) throw error;
        setUserStakes(data || []);
      }
    } catch (error: any) {
      console.error('Error fetching user stakes:', error);
    }
  };

  const handleStake = async () => {
    if (!user || !selectedPool || !stakeAmount) return;

    const amount = parseFloat(stakeAmount);
    if (amount < selectedPool.min_stake_amount) {
      toast({
        title: "Insufficient Stake Amount",
        description: `Minimum stake for this pool is ${selectedPool.min_stake_amount} BATT`,
        variant: "destructive",
      });
      return;
    }

    if (amount > userTokenBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough BATT tokens",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, this would involve blockchain transactions
      // For now, we'll simulate the staking process
      
      toast({
        title: "Staking Successful",
        description: `Successfully staked ${amount} BATT tokens in ${selectedPool.pool_name}`,
      });

      setStakeAmount('');
      setSelectedPool(null);
      fetchPools();
      fetchUserStakes();
    } catch (error: any) {
      toast({
        title: "Staking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getPoolTypeColor = (type: string) => {
    switch (type) {
      case 'community': return 'bg-blue-500';
      case 'emergency': return 'bg-red-500';
      case 'grid_support': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPoolTypeIcon = (type: string) => {
    switch (type) {
      case 'community': return <Users className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'grid_support': return <Shield className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Energy Pools</h2>
          <p className="text-muted-foreground">
            Stake BATT tokens to support community energy initiatives and earn rewards
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Your Balance</p>
          <p className="text-2xl font-bold text-green-600">{userTokenBalance.toLocaleString()} BATT</p>
        </div>
      </div>

      <Tabs defaultValue="pools" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pools">Available Pools</TabsTrigger>
          <TabsTrigger value="mystakes">My Stakes</TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pools.map((pool) => (
              <Card key={pool.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      {getPoolTypeIcon(pool.pool_type)}
                      <span>{pool.pool_name}</span>
                    </CardTitle>
                    <Badge className={getPoolTypeColor(pool.pool_type)}>
                      {pool.pool_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription>{pool.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">APY Rate</p>
                      <p className="text-xl font-bold text-green-600">{pool.apy_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Min. Stake</p>
                      <p className="text-lg font-semibold">{pool.min_stake_amount} BATT</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Staked</span>
                      <span>{pool.total_staked_tokens.toLocaleString()} BATT</span>
                    </div>
                    <Progress value={(pool.total_staked_tokens / 300000) * 100} />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{pool.total_participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{pool.location_area}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedPool(pool)}
                        disabled={!user}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Stake Tokens
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Stake in {pool.pool_name}</DialogTitle>
                        <DialogDescription>
                          Stake your BATT tokens to earn {pool.apy_rate}% APY and support community energy initiatives.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="stake-amount">Stake Amount (BATT)</Label>
                          <Input
                            id="stake-amount"
                            type="number"
                            placeholder={`Min: ${pool.min_stake_amount}`}
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            min={pool.min_stake_amount}
                            max={userTokenBalance}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Available: {userTokenBalance.toLocaleString()} BATT
                          </p>
                        </div>

                        {stakeAmount && (
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Stake Amount:</span>
                              <span>{parseFloat(stakeAmount || '0').toLocaleString()} BATT</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Estimated Annual Rewards:</span>
                              <span className="text-green-600">
                                {(parseFloat(stakeAmount || '0') * pool.apy_rate / 100).toLocaleString()} BATT
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Monthly Rewards:</span>
                              <span className="text-green-600">
                                {(parseFloat(stakeAmount || '0') * pool.apy_rate / 100 / 12).toLocaleString()} BATT
                              </span>
                            </div>
                          </div>
                        )}

                        <Button onClick={handleStake} className="w-full" disabled={!stakeAmount}>
                          Confirm Stake
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mystakes" className="space-y-4">
          {userStakes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Coins className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Stakes</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You haven't staked in any community pools yet. Start earning rewards by staking your BATT tokens.
                </p>
                <Button onClick={() => document.querySelector('[value="pools"]')?.click()}>
                  Browse Pools
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {userStakes.map((stake) => {
                const pool = pools.find(p => p.id === stake.pool_id);
                if (!pool) return null;

                return (
                  <Card key={stake.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{pool.pool_name}</span>
                        <Badge variant="outline">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Staked on {new Date(stake.stake_date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Staked Amount</p>
                          <p className="text-lg font-semibold">{stake.staked_amount.toLocaleString()} BATT</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Rewards Earned</p>
                          <p className="text-lg font-semibold text-green-600">
                            {stake.rewards_earned.toLocaleString()} BATT
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>APY Rate:</span>
                          <span className="text-green-600">{pool.apy_rate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pool Type:</span>
                          <span className="capitalize">{pool.pool_type.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Add More
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Minus className="h-4 w-4 mr-2" />
                          Unstake
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};