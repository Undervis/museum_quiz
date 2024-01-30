import {createWebHistory, createRouter} from "vue-router";
import Home from "@/Home.vue";
import ManageBoard from "@/ManageBoard.vue";
import Quiz from "@/Quiz.vue";
import EditQuiz from "@/components/EditQuiz.vue";

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
        path: "/manage/quiz",
        name: "EditQuiz",
        component: EditQuiz,
        query: {question: 0}
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