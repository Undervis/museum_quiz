import {createWebHistory, createRouter} from "vue-router";
import Home from "@/Home.vue";
import ManageBoard from "@/ManageBoard.vue";
import Quiz from "@/Quiz.vue";
import EditQuiz from "@/components/EditQuiz/EditQuiz.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/manage",
        name: "Manage",
        component: ManageBoard
    },
    {
        path: "/manage/quiz/:id",
        name: "EditQuiz",
        component: EditQuiz
    },
    {
        path: "/quiz/:id",
        name: "Quiz",
        component: Quiz
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;