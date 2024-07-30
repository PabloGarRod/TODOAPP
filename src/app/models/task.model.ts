export interface Task {
  id: number;
  title: string;
  completed: boolean;
  editing?: boolean;
}

export type Filter = 'all' | 'pending' | 'completed';
