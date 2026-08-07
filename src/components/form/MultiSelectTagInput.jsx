import { useState, useRef, useEffect } from "react";
import {
    Box,
    Text,
    Stack,
    HStack,
    Input,
    Icon,
} from "@chakra-ui/react";
import { LuX, LuChevronDown, LuPlus } from "react-icons/lu";

export default function MultiSelectTagInput({
    label,
    placeholder = "Nhấp để chọn hoặc nhập mới...",
    options = [],
    selectedValues = [],
    onChange,
    isDark = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        // Normalize options to string list
        const normalized = options.map(opt => (typeof opt === "string" ? opt : opt.value || opt.label));
        setAvailableOptions(prev => {
            const combined = new Set([...normalized, ...prev]);
            return Array.from(combined);
        });
    }, [options]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectOption = (optionValue) => {
        if (!selectedValues.includes(optionValue)) {
            onChange([...selectedValues, optionValue]);
        }
        setInputValue("");
    };

    const handleRemoveOption = (optionValue, e) => {
        e.stopPropagation();
        onChange(selectedValues.filter(val => val !== optionValue));
    };

    const handleAddNewCustom = () => {
        const trimmed = inputValue.trim();
        if (trimmed) {
            if (!availableOptions.includes(trimmed)) {
                setAvailableOptions(prev => [...prev, trimmed]);
            }
            if (!selectedValues.includes(trimmed)) {
                onChange([...selectedValues, trimmed]);
            }
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddNewCustom();
        }
    };

    const filteredOptions = availableOptions.filter(opt =>
        opt.toLowerCase().includes(inputValue.toLowerCase()) && !selectedValues.includes(opt)
    );

    const isExactMatch = availableOptions.some(opt => opt.toLowerCase() === inputValue.trim().toLowerCase()) ||
        selectedValues.some(val => val.toLowerCase() === inputValue.trim().toLowerCase());

    return (
        <Box position="relative" w="100%" ref={containerRef}>
            {label && <Text mb={2} fontWeight={600}>{label}</Text>}

            {/* Input Trigger Box */}
            <Box
                onClick={() => setIsOpen(prev => !prev)}
                p={2.5}
                borderRadius="md"
                bg={isDark ? "#1f2852" : "#ffffff"}
                border="1px solid"
                borderColor="rgba(148, 163, 184, 0.25)"
                minH="45px"
                cursor="pointer"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                wrap="wrap"
                gap={2}
                transition="all 0.2s"
                _hover={{ borderColor: "rgba(148, 163, 184, 0.5)" }}
            >
                <HStack gap={2} wrap="wrap" flex="1">
                    {selectedValues.map((val) => (
                        <Box
                            key={val}
                            px={2.5}
                            py={1}
                            borderRadius="sm"
                            bg={isDark ? "rgba(59, 130, 246, 0.2)" : "#e0e7ff"}
                            color={isDark ? "#60a5fa" : "#2563eb"}
                            border="1px solid"
                            borderColor={isDark ? "#3b82f6" : "#c7d2fe"}
                            fontSize="xs"
                            fontWeight={600}
                            display="flex"
                            alignItems="center"
                            gap={1.5}
                        >
                            <Text>{val}</Text>
                            <Box
                                as="span"
                                onClick={(e) => handleRemoveOption(val, e)}
                                cursor="pointer"
                                display="inline-flex"
                                alignItems="center"
                                p={0.5}
                                borderRadius="sm"
                                _hover={{ bg: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }}
                            >
                                <LuX size={12} />
                            </Box>
                        </Box>
                    ))}

                    <Input
                        variant="unstyled"
                        placeholder={selectedValues.length === 0 ? placeholder : "Nhập hoặc thêm mới..."}
                        value={inputValue}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOpen) setIsOpen(true);
                        }}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            if (!isOpen) setIsOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        fontSize="sm"
                        color={isDark ? "white" : "black"}
                        flex="1"
                        minW="120px"
                        h="auto"
                        p={0}
                        _placeholder={{ color: isDark ? "#64748b" : "#94a3b8" }}
                    />
                </HStack>

                <Icon
                    as={LuChevronDown}
                    boxSize={4}
                    color="gray.400"
                    transition="transform 0.2s"
                    transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                />
            </Box>

            {/* Dropdown Options Panel */}
            {isOpen && (
                <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    mt={1}
                    maxH="220px"
                    overflowY="auto"
                    bg={isDark ? "#111a3a" : "#ffffff"}
                    border="1px solid"
                    borderColor={isDark ? "#1d2a5e" : "#e2e8f0"}
                    borderRadius="md"
                    boxShadow="xl"
                    zIndex={1000}
                    p={2}
                >
                    {filteredOptions.length > 0 ? (
                        <Stack spacing={1}>
                            {filteredOptions.map((opt) => (
                                <Box
                                    key={opt}
                                    onClick={() => handleSelectOption(opt)}
                                    p={2}
                                    borderRadius="sm"
                                    cursor="pointer"
                                    fontSize="sm"
                                    color={isDark ? "#e2e8f0" : "#0f172a"}
                                    _hover={{
                                        bg: isDark ? "#1f2852" : "#f1f5f9",
                                        color: isDark ? "#60a5fa" : "#2563eb"
                                    }}
                                    transition="all 0.15s"
                                >
                                    {opt}
                                </Box>
                            ))}
                        </Stack>
                    ) : !inputValue.trim() ? (
                        <Text p={2} fontSize="sm" color="gray.400" textAlign="center">
                            Đã chọn tất cả gợi ý. Nhập để thêm mới.
                        </Text>
                    ) : null}

                    {/* Add Custom Button if input isn't empty */}
                    {inputValue.trim() && !isExactMatch && (
                        <Box
                            onClick={handleAddNewCustom}
                            mt={filteredOptions.length > 0 ? 1 : 0}
                            pt={filteredOptions.length > 0 ? 2 : 0}
                            borderTop={filteredOptions.length > 0 ? "1px solid" : "none"}
                            borderColor={isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}
                        >
                            <HStack
                                p={2}
                                borderRadius="sm"
                                cursor="pointer"
                                fontSize="sm"
                                fontWeight={600}
                                color={isDark ? "#60a5fa" : "#2563eb"}
                                bg={isDark ? "rgba(59, 130, 246, 0.1)" : "#eef4ff"}
                                _hover={{ bg: isDark ? "rgba(59, 130, 246, 0.2)" : "#dbeafe" }}
                            >
                                <LuPlus size={16} />
                                <Text>Thêm mới: "{inputValue.trim()}"</Text>
                            </HStack>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
}
