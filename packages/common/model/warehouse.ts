// Warehouse Listing interface
export interface IWarehouse {
  title: string;
  description: string;
  pricePerDay: number;
  badges: [string];
  rating: number;
  reviewsCount: number;
  locationId: string;
  location?: IWarehouseLocation;
  providerId: string;
  provider?: IWarehouseProvider;
}

// warehouse provider
export interface IWarehouseProvider {
  name: string;
  email: string;
  phone?: string;
  warehouses?: IWarehouse[];
}

// Location interface
export interface IWarehouseLocation {
  city: string;
  region: string;
  distanceFromLogisticHub: number;
  warehouses?: IWarehouse[];
}
