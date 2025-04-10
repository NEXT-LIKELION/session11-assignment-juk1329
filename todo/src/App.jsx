import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, Box, Typography, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetch("/src/assets/data.json")
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const [priority, setPriority] = useState("medium");
    const [inputValue, setInputValue] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [latestTodo, setLatestTodo] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleAddTodo = () => {
        if (inputValue.trim()) {
            const newTodo = {
                task: inputValue,
                priority: priority,
                isDone: false,
            };
            setTodos([...todos, newTodo]);
            setInputValue("");

            setLatestTodo(inputValue);
            setOpenSnackbar(true);
        }
    };

    const handleToggleTodo = (index) => {
        setTodos(
            todos.map((todo, i) =>
                i === index ? { ...todo, isDone: !todo.isDone } : todo
            )
        );
    };

    useEffect(() => {
        if (openSnackbar) {
            const timer = setTimeout(() => {
                setOpenSnackbar(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [openSnackbar]);

    return (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        py: 4,
                        width: "60%",
                        minWidth: "800px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        fontWeight="bold"
                    >
                        NEXT Todo App
                    </Typography>
                    <TodoForm
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleAddTodo={handleAddTodo}
                        handlePriorityChange={handlePriorityChange}
                        priority={priority}
                    />
                    <TodoList
                        todos={todos}
                        handleToggleTodo={handleToggleTodo}
                    />
                    <Snackbar
                        open={openSnackbar}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                        }}
                    >
                        <Alert severity="success" sx={{ width: "100%" }}>
                            "{latestTodo}" 할 일이 추가되었습니다.
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
