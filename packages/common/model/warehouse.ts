export type WarehouseVariant = 'standard' | 'tempControlled' | 'secure';

// Warehouse Listing interface
export interface IWarehouse {
  _id: string;
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
  distanceFromLogisticHub?: number;
  warehouseVariant?: WarehouseVariant;
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
  warehouses?: IWarehouse[];
}

export type IWarehouseWithRegion = Omit<IWarehouseLocation, 'warehouses'>;
