import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../views/Dashboard";
//views
import AddKingdom from "../views/kingdoms/AddKingdom";
import ManageKingdoms from "../views/kingdoms/ManageKingdoms";
import AddPhylum from "../views/phylums/AddPhylum";
import AddClass from "../views/classes/AddClass";
import NotFound from "../views/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/kingdoms/addKingdom",
                element: <AddKingdom />
            },
            {
                path: "/kingdoms/addkingdom",
                element: <AddKingdom />
            },
            {
                path: "/kingdoms/add",
                element: <AddKingdom />
            },
            {
                path: "/kingdoms/manage",
                element: <ManageKingdoms />
            },
            {
                path: "/phylums/addPhylum",
                element: <AddPhylum />
            },
            {
                path: "/phylums/addphylum",
                element: <AddPhylum />
            },
            {
                path: "/phylums/add",
                element: <AddPhylum />
            },
            {
                path: "/phylums/manage",
                element: <ManageKingdoms />
            },
            {
                path: "/classes/addClass",
                element: <AddClass />
            },
            {
                path: "/classes/addclass",
                element: <AddClass />
            },
            {
                path: "/classes/add",
                element: <AddClass />
            },
            {
                path: "/classes/manage",
                element: <ManageKingdoms />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
]);

export default router;