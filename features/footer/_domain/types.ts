export type FooterItemType = {
  id: string;
  url: string;
  label: string;
  Icon: React.FC<{ className?: string }>;
  count?: number;
};
