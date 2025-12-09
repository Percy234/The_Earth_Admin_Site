import {
    Alert,
    CloseButton,
} from "@chakra-ui/react"
import { useState } from "react";


export default function AlertMessage({
    status = "info",
    title = "Message",
    content = "This is an alert message.",
    onClose
}) {
    return (
        <Alert.Root status={status}>
            <Alert.Indicator />
            <Alert.Content>
                <Alert.Title>{title}</Alert.Title>
                <Alert.Description>
                    {content.split('\n').map((line, index) => (
                        <span key={index}>
                            {line}<br />
                        </span>
                    ))}
                </Alert.Description>
            </Alert.Content>
            <CloseButton onClick={onClose} pos="relative" top="-2" insetEnd="-2" />
        </Alert.Root>
    )
};