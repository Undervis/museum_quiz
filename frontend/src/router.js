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
    },
    {
        path: "/login",
        component: () => import("@/Login.vue")
    },
    {
        path: "/logout",
        component: () => import("@/Logout.vue")
    },
    {
        path: "/:catchAll(.*)",
        name: "NotFound",
        component: () => import("@/NotFound.vue")
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return {
                el: to.hash,
                behavior: "smooth",
            };
        }
    },
});

export default router;