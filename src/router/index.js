import { createRouter, createWebHistory } from "vue-router";

const modules = import.meta.glob("../apps/*/index.js", { eager: true });
const routes = [{ path: "/", name: "home", component: () => import("../views/home.vue") }];

window.apps = [];
Object.keys(modules).forEach(key => {
    const module = modules[key].default;
    const routeList = module.router;
    const path = key.split("/");
    const appname = path[path.indexOf("apps") + 1];
    if (Array.isArray(routeList)) {
        const moduleRoutes = routeList.map(route => {
            const path = `/${appname}${route.path}`;
            if (route.home) {
                const data = JSON.parse(JSON.stringify(module));
                delete data.router;
                window.apps.push({ ...data, path });
            }
            return { ...route, path };
        });
        routes.push(...moduleRoutes);
    }
});

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
