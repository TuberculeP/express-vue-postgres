export interface Foo {
  id: number;
  bar: string;
}

export type Note = {
  frequency: number;
  key: string;
  color: string;
  scale: string;
};

export type User = {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  role: string;
  createdAt: Date;
};
