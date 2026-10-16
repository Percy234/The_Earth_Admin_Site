import { useEffect, useRef } from "react";
import { Textarea } from "@chakra-ui/react";

export default function AutoResizeTextarea({
    value = "",
    onChange,
    minH = "160px",
    rows = 6,
    style,
    ...props
}) {
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        const minHeightNum = parseInt(minH, 10) || 0;
        const targetHeight = Math.max(textarea.scrollHeight, minHeightNum);
        textarea.style.height = `${targetHeight}px`;
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <Textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => {
                adjustHeight();
                onChange?.(e);
            }}
            minH={minH}
            resize="none"
            overflow="hidden"
            style={{
                ...style,
                transition: "height 0.1s ease-out",
            }}
            {...props}
        />
    );
}
