// //react
// import { Outlet } from 'react-router-dom'
// import { useTheme } from 'next-themes'
// import { useState } from 'react';
// //chakra ui
// import {
//     Container,
//     Grid,
//     GridItem,
//     Box,
//     Switch,
//     Text,
//     Flex,
//     SwitchThumbIndicator
// } from '@chakra-ui/react'   
// import { 
//     HiMoon, 
//     HiSun,
//     HiOutlineSearch 
// } from "react-icons/hi";

// //components
// import Search from '../components/ui/Search';
// import Navbar from '../components/ui/Navbar';
// import Sidebar from '../components/ui/Sidebar';

// const BG_IMGS = {
//     dark: [
//         '/backgrounds/dark/bg1.png',
//     ],
//     light: [
//         '/backgrounds/light/bg1.png',
//         '/backgrounds/light/bg2.png',
//     ]
// }


// export default function MainLayout() {
//     const { theme, setTheme } = useTheme()
//     const [headerBg, setHeaderBg] = useState(() => {
//         const imgs = BG_IMGS[theme]
//         const randomIndex = Math.floor(Math.random() * imgs.length)
//         return imgs[randomIndex]
//     })


//     // ============== Handlers ===================
//     //đặt background ngẫu nhiên cho header dựa vào theme hiện tại
//     const setBg = (theme) => {
//         const imgs = BG_IMGS[theme]
//         const randomIndex = Math.floor(Math.random() * imgs.length)
//         setHeaderBg(imgs[randomIndex])
//     }
//     //thay đổi theme và cập nhật background
//     const switchTheme = (newTheme) => {
//         setTheme(newTheme)
//         setBg(newTheme)
//     }
//     return (
//         <Box>
//             <Box 
//             p={4}
//             bgImage={`url('${headerBg}')`}
//             bgSize={"cover"}
//             bgRepeat={"no-repeat"}
//             bgPosition={"center"}
//             borderBottom={"1px solid"}
//             borderColor={theme === 'dark' ? "gray.700" : "gray.200"}
//             >
//                 <Grid templateColumns="repeat(4, 1fr)" gap={4}>
//                     <GridItem colSpan={1} className='h-full'>
//                         <Box>
//                             <Text 
//                             fontSize={"2xl"} 
//                             fontWeight={"bold"} 
//                             textTransform={"uppercase"}
//                             >Dashboard</Text>
//                         </Box>
//                     </GridItem>
//                     <GridItem colSpan={3}>
//                         <Flex justifyContent={'space-between'} alignItems={'center'} gap={4}>
//                             <Box flex={3}>
//                                 <Navbar links={[
//                                     {name: 'Dashboard', path: '/dashboard'},
//                                 ]} />
//                             </Box>
//                             <Box marginStart={"auto"} flex={1}>
//                                 <Search />
//                             </Box>
//                             <Box marginStart={"auto"}>
//                                 <Switch.Root
//                                 size={"lg"}
//                                 checked={theme === 'dark'}
//                                 onCheckedChange={(e) => switchTheme(e.checked ? 'dark' : 'light')}
//                                 >
//                                 <Switch.HiddenInput />
//                                 <Switch.Control>
//                                     <Switch.Thumb>
//                                         <Switch.ThumbIndicator fallback={<HiSun />}>
//                                             <HiMoon />
//                                         </Switch.ThumbIndicator>
//                                     </Switch.Thumb>
//                                 </Switch.Control>
//                                 </Switch.Root>
//                             </Box>
//                         </Flex>
//                     </GridItem>
//                 </Grid>
//             </Box>
//             <Box h='vh'>
//                 <Grid templateColumns="repeat(4, 1fr)" gap={4}>
//                     <GridItem colSpan={1}>
//                         <Box 
//                         h={"100%"}
//                         borderRight={"1px solid"}
//                         borderColor={theme === 'dark' ? "gray.700" : "gray.200"}
//                         >
//                             <Sidebar links={[
//                                 {name: "Quản lý các giới", path: "/kingdoms"},
//                                 {name: "Thêm giới mới", path: "/kingdoms/add"}
//                             ]} />
//                         </Box>
//                     </GridItem>
//                     <GridItem colSpan={3}>
//                         <Box>
//                             <Outlet />
//                         </Box>
//                     </GridItem>
//                 </Grid>
//             </Box>
//         </Box>
//     )
// }
import { Outlet } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import ScrollToTop from '../components/ui/ScrollToTop'
import { Toaster } from '../components/ui/Toaster';

export default function MainLayout() {
    return (
        <Box>
            <ScrollToTop/>
            <Outlet />
            <Toaster />
        </Box>
    )
}