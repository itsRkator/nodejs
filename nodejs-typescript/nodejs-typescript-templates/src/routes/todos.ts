import { NextFunction, Request, Response, Router } from "express";
import { Todo } from "../models/todo";

// const TO_DOS: Todo[] = []; // Alternate of line 5
let TO_DOS: Array<Todo> = [];

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ todo: TO_DOS });
});

router.post("/todo", (req: Request, res: Response, next: NextFunction) => {
  const { text } = req.body;

  const newTodo: Todo = { id: Date.now().toString(), text };

  TO_DOS.push(newTodo);

  res.status(201).json({ message: "To Do Created!!", todo: newTodo });
});

router.put(
  "/todo/:id",
  (req: Request, res: Response, next: NextFunction): any => {
    const { id } = req.params;
    const { text } = req.body;

    const todoIndex = TO_DOS.findIndex((todoItem) => todoItem.id === id);

    if (todoIndex >= 0) {
      TO_DOS[todoIndex] = { id, text } as Todo;
      return res
        .status(200)
        .json({ message: "Updated!!", todo: TO_DOS[todoIndex] });
    }

    res.status(404).json({ message: "Not Found!!" });
  }
);

router.delete(
  "/todo/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    TO_DOS = TO_DOS.filter((todoItem) => todoItem.id !== id);

    res.status(200).json({ message: "To Do deleted successfully" });
  }
);

export default router;
