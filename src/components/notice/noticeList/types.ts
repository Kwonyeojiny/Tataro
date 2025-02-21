export type Notice = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  img_url?: string;
  order: number;
  category: string;
  user: number;
};

export type NoticesResponse = {
  page: number;
  size: number;
  total_pages: number;
  total_count: number;
  results: Notice[];
};
