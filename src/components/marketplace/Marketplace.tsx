import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Battery, 
  Coins, 
  TrendingUp, 
  MapPin, 
  Clock, 
  User,
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Package,
  ArrowUpDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MarketplaceListing {
  id: string;
  seller_id: string;
  listing_type: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  energy_delivery_time: string | null;
  location_constraint: string;
  status: string;
  created_at: string;
  expires_at: string;
}

export const Marketplace: React.FC = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  
  // New listing form
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [newListing, setNewListing] = useState({
    listing_type: '',
    title: '',
    description: '',
    price: '',
    quantity: '',
    unit: '',
    location_constraint: '',
    energy_delivery_time: ''
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchTerm, filterType, sortBy]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings_2025_10_22_14_48')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      toast({
        title: "Error Loading Marketplace",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = listings;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(listing => listing.listing_type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'quantity':
          return b.quantity - a.quantity;
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredListings(filtered);
  };

  const handleCreateListing = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, this would create the listing in the database
      toast({
        title: "Listing Created",
        description: "Your listing has been created successfully",
      });

      setShowCreateListing(false);
      setNewListing({
        listing_type: '',
        title: '',
        description: '',
        price: '',
        quantity: '',
        unit: '',
        location_constraint: '',
        energy_delivery_time: ''
      });
      fetchListings();
    } catch (error: any) {
      toast({
        title: "Error Creating Listing",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handlePurchase = async (listing: MarketplaceListing) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a purchase",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would handle the purchase transaction
    toast({
      title: "Purchase Initiated",
      description: `Purchase request for ${listing.title} has been initiated`,
    });
  };

  const getListingTypeIcon = (type: string) => {
    switch (type) {
      case 'energy_trade': return <Zap className="h-4 w-4" />;
      case 'equipment': return <Battery className="h-4 w-4" />;
      case 'token_swap': return <Coins className="h-4 w-4" />;
      case 'futures_contract': return <TrendingUp className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getListingTypeColor = (type: string) => {
    switch (type) {
      case 'energy_trade': return 'bg-blue-500';
      case 'equipment': return 'bg-green-500';
      case 'token_swap': return 'bg-yellow-500';
      case 'futures_contract': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatPrice = (price: number, unit: string) => {
    if (unit === 'kwh') return `$${price.toFixed(3)}/kWh`;
    if (unit === 'token') return `$${price.toFixed(4)}/token`;
    if (unit === 'piece') return `$${price.toLocaleString()}`;
    if (unit === 'contract') return `$${price.toFixed(2)}/contract`;
    return `$${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-gray-200 rounded"></div>
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
          <h2 className="text-2xl font-bold">Energy Marketplace</h2>
          <p className="text-muted-foreground">
            Trade energy, equipment, tokens, and futures contracts
          </p>
        </div>
        <Dialog open={showCreateListing} onOpenChange={setShowCreateListing}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
              <DialogDescription>
                List your energy, equipment, or tokens for sale in the marketplace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="listing-type">Listing Type</Label>
                  <Select value={newListing.listing_type} onValueChange={(value) => 
                    setNewListing(prev => ({ ...prev, listing_type: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energy_trade">Energy Trade</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="token_swap">Token Swap</SelectItem>
                      <SelectItem value="futures_contract">Futures Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={newListing.unit} onValueChange={(value) => 
                    setNewListing(prev => ({ ...prev, unit: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kwh">kWh</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="token">Token</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newListing.title}
                  onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter listing title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newListing.description}
                  onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your listing"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newListing.price}
                    onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={newListing.quantity}
                    onChange={(e) => setNewListing(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location Constraint</Label>
                <Input
                  id="location"
                  value={newListing.location_constraint}
                  onChange={(e) => setNewListing(prev => ({ ...prev, location_constraint: e.target.value }))}
                  placeholder="e.g., Within 50 miles of San Francisco"
                />
              </div>

              <Button onClick={handleCreateListing} className="w-full">
                Create Listing
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="energy_trade">Energy Trade</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
            <SelectItem value="token_swap">Token Swap</SelectItem>
            <SelectItem value="futures_contract">Futures Contract</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="quantity">Quantity</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge className={getListingTypeColor(listing.listing_type)}>
                  {getListingTypeIcon(listing.listing_type)}
                  <span className="ml-1 capitalize">
                    {listing.listing_type.replace('_', ' ')}
                  </span>
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(listing.created_at).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {listing.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPrice(listing.price, listing.unit)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {listing.quantity} {listing.unit} available
                  </p>
                </div>
              </div>

              {listing.location_constraint && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{listing.location_constraint}</span>
                </div>
              )}

              {listing.energy_delivery_time && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Delivery: {new Date(listing.energy_delivery_time).toLocaleString()}</span>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={() => handlePurchase(listing)} 
                  className="flex-1"
                  disabled={!user}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {listing.listing_type === 'token_swap' ? 'Swap' : 'Buy'}
                </Button>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </div>

              {listing.expires_at && (
                <div className="text-xs text-muted-foreground">
                  Expires: {new Date(listing.expires_at).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Listings Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || filterType !== 'all' 
                ? "Try adjusting your search or filters" 
                : "Be the first to create a listing in the marketplace"
              }
            </p>
            <Button onClick={() => setShowCreateListing(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Listing
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};