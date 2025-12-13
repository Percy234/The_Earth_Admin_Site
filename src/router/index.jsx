import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../views/Dashboard";
//views
import AddKingdomView from "../views/kingdoms/AddView";
import ManageKingdoms from "../views/kingdoms/ManageView";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
        ]
    },
    {
        path: "/kingdoms",
        element: <MainLayout />,
        children: [
            {
                path: "/kingdoms",
                element: <ManageKingdoms />
            },
            {
                path: "/kingdoms/add",
                element: <AddKingdomView />
            }
        ]
    }
]);

export default router;