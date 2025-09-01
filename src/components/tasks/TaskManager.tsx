import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Plus, CalendarIcon, CheckCircle, Clock, Target, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: Date;
  createdAt: Date;
}

interface Habit {
  id: string;
  name: string;
  description?: string;
  streak: number;
  target: number;
  completedToday: boolean;
  lastCompleted?: Date;
}

const TASK_CATEGORIES = ["Work", "Personal", "Health", "Finance", "Shopping", "Family", "Other"];
const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
];

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [taskOpen, setTaskOpen] = useState(false);
  const [habitOpen, setHabitOpen] = useState(false);
  
  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskCategory, setTaskCategory] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<Date>();
  
  // Habit form state
  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitTarget, setHabitTarget] = useState("30");
  
  const { toast } = useToast();

  useEffect(() => {
    // Load mock data
    setTasks([
      {
        id: '1',
        title: 'Review monthly budget',
        description: 'Check expenses and update budget allocations',
        completed: false,
        priority: 'high',
        category: 'Finance',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Buy groceries',
        completed: true,
        priority: 'medium',
        category: 'Shopping',
        createdAt: new Date()
      }
    ]);

    setHabits([
      {
        id: '1',
        name: 'Daily expense tracking',
        description: 'Log all expenses for the day',
        streak: 15,
        target: 30,
        completedToday: true,
        lastCompleted: new Date()
      },
      {
        id: '2',
        name: 'Read financial news',
        description: 'Stay updated with market trends',
        streak: 8,
        target: 21,
        completedToday: false
      }
    ]);
  }, []);

  const createTask = () => {
    if (!taskTitle.trim() || !taskCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      completed: false,
      priority: taskPriority,
      category: taskCategory,
      dueDate: taskDueDate,
      createdAt: new Date()
    };

    setTasks([...tasks, newTask]);
    
    // Reset form
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority('medium');
    setTaskCategory("");
    setTaskDueDate(undefined);
    setTaskOpen(false);

    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  const createHabit = () => {
    if (!habitName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive",
      });
      return;
    }

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitName,
      description: habitDescription,
      streak: 0,
      target: parseInt(habitTarget),
      completedToday: false
    };

    setHabits([...habits, newHabit]);
    
    // Reset form
    setHabitName("");
    setHabitDescription("");
    setHabitTarget("30");
    setHabitOpen(false);

    toast({
      title: "Success",
      description: "Habit created successfully",
    });
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completedToday;
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          lastCompleted: newCompleted ? new Date() : habit.lastCompleted
        };
      }
      return habit;
    }));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Success",
      description: "Task deleted successfully",
    });
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    toast({
      title: "Success",
      description: "Habit deleted successfully",
    });
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const activeHabits = habits.filter(habit => habit.completedToday).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Tasks</p>
                <p className="text-2xl font-bold">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
                <p className="text-2xl font-bold">{pendingTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Habits</p>
                <p className="text-2xl font-bold">{activeHabits}/{habits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Task List</CardTitle>
                <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="taskTitle">Title</Label>
                        <Input
                          id="taskTitle"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="taskDescription">Description</Label>
                        <Textarea
                          id="taskDescription"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          placeholder="Task description (optional)"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="taskPriority">Priority</Label>
                          <Select value={taskPriority} onValueChange={(value: 'low' | 'medium' | 'high') => setTaskPriority(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PRIORITIES.map((priority) => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  {priority.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="taskCategory">Category</Label>
                          <Select value={taskCategory} onValueChange={setTaskCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {TASK_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Due Date (optional)</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {taskDueDate ? format(taskDueDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={taskDueDate}
                              onSelect={setTaskDueDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button onClick={createTask} className="w-full">
                        Create Task
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const priority = PRIORITIES.find(p => p.value === task.priority);
                  return (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <Badge variant="outline" className={priority?.color}>
                              {priority?.label}
                            </Badge>
                            <Badge variant="secondary">{task.category}</Badge>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                          {task.dueDate && (
                            <p className="text-sm text-muted-foreground">
                              Due: {format(task.dueDate, "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks yet. Create your first task to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Habit Tracker</CardTitle>
                <Dialog open={habitOpen} onOpenChange={setHabitOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Habit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Habit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="habitName">Habit Name</Label>
                        <Input
                          id="habitName"
                          value={habitName}
                          onChange={(e) => setHabitName(e.target.value)}
                          placeholder="Enter habit name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="habitDescription">Description</Label>
                        <Textarea
                          id="habitDescription"
                          value={habitDescription}
                          onChange={(e) => setHabitDescription(e.target.value)}
                          placeholder="Habit description (optional)"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="habitTarget">Target (days)</Label>
                        <Input
                          id="habitTarget"
                          type="number"
                          value={habitTarget}
                          onChange={(e) => setHabitTarget(e.target.value)}
                          placeholder="30"
                        />
                      </div>
                      <Button onClick={createHabit} className="w-full">
                        Create Habit
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={habit.completedToday}
                          onCheckedChange={() => toggleHabit(habit.id)}
                        />
                        <div>
                          <h3 className="font-medium">{habit.name}</h3>
                          {habit.description && (
                            <p className="text-sm text-muted-foreground">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={habit.completedToday ? "default" : "secondary"}>
                          {habit.streak} day streak
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteHabit(habit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Progress: {habit.streak}/{habit.target} days</span>
                      <span>{((habit.streak / habit.target) * 100).toFixed(1)}% complete</span>
                    </div>
                  </div>
                ))}
                {habits.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No habits yet. Create your first habit to start tracking!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}