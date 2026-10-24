import { asyncHandler } from "../middlewares/asyneHandler.js";
import todo from "../models/todo.model.js";
import mongoose from "mongoose";
//post request to create a new todo
export const createTodo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }
    const Todo = await todo.create({
        title,
        description
    });
    return res.status(201).json({
        success: true,
        message: "Todo created successfully",
        Todo
    });
})

//get request to fetch all todos
export const getTodos = asyncHandler(async (req, res) => {

    //query params
    const { search, shot, page = 1, limit = 10 } = req.query;
    //Base query
    const query = {};
    //search query
    if (search) {
        query.title = { $regex: search, $options: "i" };//case insensitive search
    }
    //sort query
    let sortOption = {};
    if (shot === "asc") {
        sortOption.createdAt = 1;//1 for ascending order
    }

    else {
        sortOption.createdAt = -1;//-1 for descending order
    }

    //pagination query
    const skip = (page - 1) * limit;
    const todos = await todo.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    const totalTodos = await todo.countDocuments(query);
    return res.status(200).json({
        success: true,
        message: "Todos fetched successfully",
        total: totalTodos,
        page: Number(page),
        limit: Number(limit),
        data: todos
    });
}
)

//get request to fetch a single todo by id
export const getTodoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //valid id based on mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid todo id"
        })
    }

    const Todo = await todo.findById(id);

    if (!Todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found"
        });
    }
    //if todo  found 
    return res.status(200).json({
        success: true,
        message: "Todo fetched successfully",
        data: Todo
    });


});

//put request to update a todo by id

export const updateTodoById = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { title, description } = req.body;

    //valid id based on mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid todo id"
        });
    }
    //valid input
    if (!title || title.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }

    //update todo
    const Todo = await todo.findByIdAndUpdate(
        id,
        { title, description },
        { new: true, runValidators: true }//new:true returns the updated document
    );
    //if todo not found
    if (!Todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found"
        });
    }
    //if todo found
    return res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: Todo
    });



})

//toggle isCompleted status of a todo by id
export const toggleTodo = asyncHandler(async (req, res) => {

    const { id } = req.params;
    //valid id based on mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid todo id"
        });
    }
    const Todo = await todo.findById(id);
    if (!Todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found"
        });
    }

    //toggle isCompleted status
    Todo.isCompleted = !Todo.isCompleted;
    await Todo.save();
    return res.status(200).json({
        success: true,
        message: "Todo status toggled successfully",
        data: Todo
    });
});

//delete request to delete a todo by id
export const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    //valid id based on mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid todo id"
        });
    }
    const Todo = await todo.findByIdAndDelete(id);
    //if todo not found
    if (!Todo) {
        return res.status(404).json({
            success: false,
            message: "Todo not found"
        });
    }
    return res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: Todo
    });


});
