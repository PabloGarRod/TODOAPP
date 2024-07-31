import {
  Component,
  signal,
  computed,
  effect,
  inject,
  Injector,
} from '@angular/core';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { Task } from '../../models/task.model';
import { Filter } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  tasks = signal<Task[]>([]);

  filter = signal<Filter>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter === 'pending') {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  });

  newTaskCntrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      //Validators.pattern(/^(?!\s*$).+/)
    ],
  });

  injector = inject(Injector);

  constructor() {}

  ngOnInit() {
    const storage = localStorage.getItem('tasks');
    if (storage) {
      const tasks = JSON.parse(storage);
      this.tasks.set(tasks);
    }
    this.trackTasks();
  }

  trackTasks() {
    effect(
      () => {
        const tasks = this.tasks();
        console.log(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      },
      {
        injector: this.injector,
      }
    );
  }

  changeHandler() {
    if (this.newTaskCntrl.valid) {
      const value = this.newTaskCntrl.value.trim();
      if (value !== '') {
        this.addTask(value);
        this.newTaskCntrl.reset();
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(id: number) {
    this.tasks.update((tasks) => tasks.filter((task) => id !== task.id));
  }

  updateTask(id: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task) => {
        if (id === task.id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  }

  updateTaskEditingMode(id: number) {
    this.tasks.update((prevState) => {
      return prevState.map((task) => {
        if (id === task.id) {
          return {
            ...task,
            editing: true,
          };
        }
        return {
          ...task,
          editing: false,
        };
      });
    });
  }

  updateTaskText(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.tasks.update((tasks) => {
      return tasks.map((task) => {
        if (id === task.id) {
          return {
            ...task,
            title: input.value,
            editing: false,
          };
        }
        return {
          ...task,
        };
      });
    });
  }

  clearCompleted() {
    this.tasks.update((tasks) => {
      return tasks.filter((task) => !task.completed);
    });
  }

  changeFilter(filter: Filter) {
    this.filter.set(filter);
  }
}
