import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../views/Dashboard";
//views
import AddKingdom from "../views/kingdoms/AddKingdom";
import ManageKingdoms from "../views/kingdoms/ManageKingdoms";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
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
                path: "/kingdoms/manage",
                element: <ManageKingdoms />
            }
        ]
    }
]);

export default router;