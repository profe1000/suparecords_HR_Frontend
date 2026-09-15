export interface RoomTypeImage {
  image_url: string;
  display_order: number;
}

export interface RoomType {
  id: number;
  branch_id: number;
  name: string;
  description: string;
  base_price: string;
  discounted_price: string;
  website_price: string;
  cooperate_price: string;
  max_adults: number;
  max_children: number;
  room_size: string;
  bed_type: string;
  total_beds: number;
  feature_image: string;
  feature_video_url: string;
  staff_id: number | null;
  images: RoomTypeImage[];
}

export type RoomTypeFormValues = Omit<RoomType, "id" | "base_price" | "discounted_price" | "website_price" | "cooperate_price" | "room_size" | "staff_id"> & {
  base_price: number;
  discounted_price: number;
  website_price: number;
  cooperate_price: number;
  room_size: number;
  staff_id?: number;
};

export interface RoomTypeListResponse {
  status: string;
  message: string;
  data: RoomType[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}
