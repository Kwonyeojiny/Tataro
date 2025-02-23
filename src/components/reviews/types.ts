export type ReviewsSubmenus = 'Best' | 'New';

export type Submenus = {
  submenu: ReviewsSubmenus;
  content: () => JSX.Element | null;
};

export type ReviewListResponse = {
  id: number;
  title: string;
  taro_chat_room: number;
  content: string;
  user_nickname: string;
  created_at: string;
  updated_at: string | null;
  img_url: string;
  view_count: number;
};

export type Review = {
  id: number;
  title: string;
  room_id: number;
  content: string;
  user_nickname: string;
  created_at: string;
  updated_at: string | null;
  img_url: string;
  view_count: number;
};

export type ReviewCardProps = Review;

export type ReviewDetailProps = {
  review_id: number;
  cardImages: Array<{
    url: string;
    name: string;
    direction: string;
  }>;
  close: () => void;
};
