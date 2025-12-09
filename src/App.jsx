import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { RouterProvider } from "react-router-dom"
import router from "./router/index.jsx"

function App() {

  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <RouterProvider router={router} />
      </ThemeProvider>
    </ChakraProvider>
  )
}

export default App
