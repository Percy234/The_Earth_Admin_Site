import { 
    Heading,
    Box,
    Text,
    Grid,
    GridItem
 } from '@chakra-ui/react'
 
import { useRef, useEffect, useState } from 'react';
import DashboardHeader from "../components/ui/Header";
import ManageKingdoms from './kingdoms/ManageView';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Dashboard() {
    
    const container = useRef();
    const poster_info = useRef();
    const kingdomSection = useRef();
    const [activeSection, setActiveSection] = useState('home');
    
    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                toggleActions: "play pause resume reset",
            }
        });

        tl.fromTo(poster_info.current,
            {
                y: 0,
                opacity: 0,
                scale: 0.95
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "power2.out"
            }
        ),
        // tl.fromTo(".stat_animation",
        //     {
        //         y: 100,
        //         opacity: 0,
        //     },
        //     {
        //         y: 0,   
        //         opacity: 1,
        //         duration: 1,
        //         ease: "power2.out",
        //         stagger: 0.2,
        //     },
        // );
        ScrollTrigger.create({
            trigger: container.current,
            start: "top center",
            end: "bottom center",
            onEnter: () => setActiveSection('home'),
            onEnterBack: () => setActiveSection('home'),
        });

        // Khi ở phần ManageKingdoms (Sưu tập)
        ScrollTrigger.create({
            trigger: kingdomSection.current,
            start: "top center",
            onEnter: () => setActiveSection('collection'),
            onEnterBack: () => setActiveSection('collection'),
        });
    }, { scope: container })

    const handleScrollTo = (target) => {
        if (target === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            kingdomSection.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <Box
            display="flex"
            flexDirection="column"
        >
            <DashboardHeader 
                activeSection={activeSection} 
                onScrollTo={handleScrollTo} 
            />
            <Box
                ref={container}
                w="100%"
                minH="115vh"
                bgImage={"url('/backgrounds/home/the_earth.jpg')"}
                bgSize="cover"
                bgPosition="center"
                bgRepeat="no-repeat"
                position="relative"
            >
                <Box
                    ref={poster_info}
                    textAlign={"center"}   
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)" 
                    textShadow="0 0 16px #2E1A47"
                >
                    <Heading 
                        textTransform={"uppercase"}
                        fontSize={{ base: "4xl", md: "6xl", lg: "8xl" }}
                        lineHeight="1.2"
                    >
                        Trái Đất
                    </Heading>
                    <Text
                        fontSize={{ base: "sm", md: "xl", lg: "2xl" }}
                        mt={4}
                        maxW={"750px"}
                        color={"gray.100"}
                        fontStyle={"italic"}
                        mx="auto"
                    >
                        Bảng điều khiển quản trị của The Earth được xây dựng nhằm hỗ trợ quản lý dữ liệu sinh học và hệ sinh thái một cách khoa học và có hệ thống. 
                        Admin có thể cập nhật thông tin sinh vật, tổ chức phân loại, kiểm soát nội dung học thuật và đảm bảo tính chính xác của dữ liệu trước khi hiển thị đến người dùng.
                    </Text>
                </Box>
                <Box
                    position="absolute"
                    bottom="0"
                    left="0"
                    w="100%"
                    h="100px"
                    background="linear-gradient(to bottom, rgba(255,255,255,0) 0%, #F6F6F6 100%)"
                ></Box>
            </Box>
            <Box
                ref={kingdomSection}
                minHeight="100vh"
                backgroundColor={"#F6F6F6"}
                display="flex"
                flexDirection="column"
                // justifyContent="center"
                position="relative"
                pt="100px"
            >
                <Box
                >
                    <ManageKingdoms />
                </Box>
            </Box>
        </Box>
    )
}