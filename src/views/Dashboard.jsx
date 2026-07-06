import { Box, Heading, Text, Flex, Icon } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { PieChart, BarChart, RadarChart, EraLineChart } from '../components/ui/Chart';
import { LuSprout, LuLeaf, LuGlobe, LuHourglass } from 'react-icons/lu';

export default function Dashboard() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Box>
            <Box mb={6}>
                <Heading fontSize={{ base: "3xl", md: "40px" }} color={isDark ? "white" : "#0f172a"}>
                    Tổng quan
                </Heading>
            </Box>

            {/* Grid chứa 4 thẻ thống kê */}
                <Box
                    display="grid"
                    gridTemplateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                    gap={4}
                    mb={6}
                >
                    {/* Thẻ 1: Tổng số giới */}
                    <Box
                        p={5}
                        bg={isDark ? "#111a3a" : "white"}
                        border="1px solid"
                        borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                        borderRadius="18px"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                    >
                        <Flex align="center" justify="space-between">
                            <Box>
                                <Text fontSize="xs" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                                    Tổng số giới
                                </Text>
                                <Heading fontSize="3xl" fontWeight="bold" color={isDark ? "white" : "#0f172a"} mt={2}>
                                    5
                                </Heading>
                            </Box>
                            <Box
                                p={3}
                                bg="rgba(76, 175, 80, 0.15)"
                                color="#4CAF50"
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={LuSprout} boxSize={6} />
                            </Box>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={3}>
                            Động vật, Thực vật, Nấm...
                        </Text>
                    </Box>

                    {/* Thẻ 2: Tổng số loài */}
                    <Box
                        p={5}
                        bg={isDark ? "#111a3a" : "white"}
                        border="1px solid"
                        borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                        borderRadius="18px"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                    >
                        <Flex align="center" justify="space-between">
                            <Box>
                                <Text fontSize="xs" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                                    Số loài ước tính
                                </Text>
                                <Heading fontSize="3xl" fontWeight="bold" color={isDark ? "white" : "#0f172a"} mt={2}>
                                    2.2M+
                                </Heading>
                            </Box>
                            <Box
                                p={3}
                                bg="rgba(3, 169, 244, 0.15)"
                                color="#03A9F4"
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Icon as={LuLeaf} boxSize={6} />
                            </Box>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={3}>
                            ~1.5M Động vật, 390K Thực vật
                        </Text>
                    </Box>

                    {/* Thẻ 3: Môi trường sống */}
                    <Box
                        p={5}
                        bg={isDark ? "#111a3a" : "white"}
                        border="1px solid"
                        borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                        borderRadius="18px"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                    >
                        <Flex align="center" justify="space-between">
                            <Box flex="1" minW={0}>
                                <Text fontSize="xs" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                                    Môi trường chủ yếu
                                </Text>
                                <Heading fontSize="xl" fontWeight="bold" color={isDark ? "white" : "#0f172a"} mt={2.5} mb={0.5} noOfLines={1} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                    Trên cạn (~67%)
                                </Heading>
                            </Box>
                            <Box
                                p={3}
                                bg="rgba(255, 159, 64, 0.15)"
                                color="rgba(255, 159, 64, 1)"
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                            >
                                <Icon as={LuGlobe} boxSize={6} />
                            </Box>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={3}>
                            Dưới nước chiếm khoảng 33%
                        </Text>
                    </Box>

                    {/* Thẻ 4: Kỷ nguyên đa dạng nhất */}
                    <Box
                        p={5}
                        bg={isDark ? "#111a3a" : "white"}
                        border="1px solid"
                        borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                        borderRadius="18px"
                        boxShadow="sm"
                        transition="all 0.2s"
                        _hover={{ transform: "translateY(-3px)", boxShadow: "md" }}
                    >
                        <Flex align="center" justify="space-between">
                            <Box flex="1" minW={0}>
                                <Text fontSize="xs" fontWeight="600" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                                    Kỷ nguyên đa dạng
                                </Text>
                                <Heading fontSize="xl" fontWeight="bold" color={isDark ? "white" : "#0f172a"} mt={2.5} mb={0.5} noOfLines={1} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                                    Tân Sinh (Cenozoic)
                                </Heading>
                            </Box>
                            <Box
                                p={3}
                                bg="rgba(156, 39, 176, 0.15)"
                                color="#9C27B0"
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                            >
                                <Icon as={LuHourglass} boxSize={6} />
                            </Box>
                        </Flex>
                        <Text fontSize="xs" color="gray.500" mt={3}>
                            Hơn 1,000,000+ loài đang phát triển
                        </Text>
                    </Box>
                </Box>
                <Box
                    flex="1"
                    display="grid"
                    gridTemplateColumns={{ base: '1fr', xl: 'repeat(3, minmax(0, 1fr))' }}
                    gridTemplateRows={{ base: 'repeat(4, minmax(320px, auto))', xl: '320px 280px' }}
                    gap={3}
                    alignItems="stretch"
                >
                    <Box
                        minH={{ base: '320px', xl: '0' }}
                        minW={0}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <PieChart />
                    </Box>

                    <Box
                        minH={{ base: '320px', xl: '0' }}
                        minW={0}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <RadarChart />
                    </Box>

                    <Box
                        minH={{ base: '320px', xl: '0' }}
                        minW={0}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <BarChart />
                    </Box>

                    <Box
                        gridColumn={{ base: 'auto', xl: '1 / -1' }}
                        minH={{ base: '320px', xl: '0' }}
                        minW={0}
                        w="100%"
                        bg={isDark ? '#111a3a' : '#ffffff'}
                        border="1px solid"
                        borderColor={isDark ? '#1d2a5e' : '#e2e8f0'}
                        borderRadius="18px"
                        boxShadow="sm"
                        p={3}
                    >
                        <EraLineChart />
                    </Box>
                </Box>
        </Box>
    )
}