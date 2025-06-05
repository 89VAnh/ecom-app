/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, Copy, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
    data: any
    className?: string
    defaultExpanded?: boolean
    searchable?: boolean
    copyable?: boolean
}

interface JsonNodeProps {
    data: any
    keyName?: string
    level?: number
    isLast?: boolean
    searchTerm?: string
    defaultExpanded?: boolean
}

const JsonNode: React.FC<JsonNodeProps> = ({
    data,
    keyName,
    level = 0,
    isLast = true,
    searchTerm = "",
    defaultExpanded = true,
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)

    const getDataType = (value: any): string => {
        if (value === null) return "null"
        if (Array.isArray(value)) return "array"
        return typeof value
    }

    const getValueColor = (value: any): string => {
        const type = getDataType(value)
        switch (type) {
            case "string":
                return "text-green-600 dark:text-green-400"
            case "number":
                return "text-blue-600 dark:text-blue-400"
            case "boolean":
                return "text-purple-600 dark:text-purple-400"
            case "null":
                return "text-gray-500 dark:text-gray-400"
            default:
                return "text-gray-900 dark:text-gray-100"
        }
    }

    const formatValue = (value: any): string => {
        const type = getDataType(value)
        switch (type) {
            case "string":
                return `"${value}"`
            case "null":
                return "null"
            default:
                return String(value)
        }
    }

    const highlightSearchTerm = (text: string, term: string): React.ReactNode => {
        if (!term) return text

        const regex = new RegExp(`(${term})`, "gi")
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            ),
        )
    }

    const shouldShowNode = (value: any, key?: string): boolean => {
        if (!searchTerm) return true

        const searchLower = searchTerm.toLowerCase()

        // Check if key matches
        if (key && key.toLowerCase().includes(searchLower)) return true

        // Check if value matches (for primitive values)
        if (typeof value === "string" && value.toLowerCase().includes(searchLower)) return true
        if (typeof value === "number" && value.toString().includes(searchLower)) return true
        if (typeof value === "boolean" && value.toString().includes(searchLower)) return true

        // For objects and arrays, check if any nested value matches
        if (typeof value === "object" && value !== null) {
            const jsonString = JSON.stringify(value).toLowerCase()
            return jsonString.includes(searchLower)
        }

        return false
    }

    if (!shouldShowNode(data, keyName)) return null

    const isObject = typeof data === "object" && data !== null && !Array.isArray(data)
    const isArray = Array.isArray(data)
    const isPrimitive = !isObject && !isArray
    const isEmpty = isObject ? Object.keys(data).length === 0 : isArray ? data.length === 0 : false

    const indent = level * 20

    if (isPrimitive) {
        return (
            <div className="flex items-center gap-2" style={{ paddingLeft: `${indent}px` }}>
                {keyName && (
                    <>
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                            {highlightSearchTerm(`"${keyName}"`, searchTerm)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">:</span>
                    </>
                )}
                <span className={getValueColor(data)}>{highlightSearchTerm(formatValue(data), searchTerm)}</span>
                {!isLast && <span className="text-gray-600 dark:text-gray-400">,</span>}
            </div>
        )
    }

    const entries = isObject ? Object.entries(data) : data.map((item: any, index: number) => [index, item])

    return (
        <div>
            <div
                className="flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-1 cursor-pointer"
                style={{ paddingLeft: `${indent}px` }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {!isEmpty && (
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </Button>
                )}
                {keyName && (
                    <>
                        <span className="text-blue-800 dark:text-blue-300 font-medium">
                            {highlightSearchTerm(`"${keyName}"`, searchTerm)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">:</span>
                    </>
                )}
                <span className="text-gray-600 dark:text-gray-400">{isArray ? "[" : "{"}</span>
                {isEmpty && <span className="text-gray-600 dark:text-gray-400">{isArray ? "]" : "}"}</span>}
                {!isEmpty && (
                    <Badge variant="secondary" className="text-xs">
                        {entries.length} {entries.length === 1 ? "item" : "items"}
                    </Badge>
                )}
                {!isLast && !isEmpty && <span className="text-gray-600 dark:text-gray-400">,</span>}
            </div>

            {!isEmpty && isExpanded && (
                <div>
                    {entries.map(
                        (
                            entry: [string, any] | [number, any],
                            index: number
                        ) => {
                            const [key, value] = entry
                            return (
                                <JsonNode
                                    key={key}
                                    data={value}
                                    keyName={isArray ? undefined : key.toString()}
                                    level={level + 1}
                                    isLast={index === entries.length - 1}
                                    searchTerm={searchTerm}
                                    defaultExpanded={defaultExpanded}
                                />
                            )
                        }
                    )}
                    <div className="text-gray-600 dark:text-gray-400" style={{ paddingLeft: `${indent}px` }}>
                        {isArray ? "]" : "}"}
                        {!isLast && <span>,</span>}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function JsonViewer({
    data,
    className,
    defaultExpanded = true,
    searchable = true,
    copyable = true,
}: JsonViewerProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [copied, setCopied] = useState(false)

    const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const clearSearch = () => {
        setSearchTerm("")
    }

    return (
        <div className={cn("border rounded-lg bg-white dark:bg-gray-900", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">JSON Viewer</h3>
                    <Badge variant="outline" className="text-xs">
                        {typeof data === "object" && data !== null
                            ? Array.isArray(data)
                                ? `Array[${data.length}]`
                                : `Object{${Object.keys(data).length}}`
                            : typeof data}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
                    {searchable && (
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-7 pr-7 h-7 w-32 text-xs"
                            />
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearSearch}
                                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    )}

                    {copyable && (
                        <Button variant="outline" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs">
                            <Copy className="h-3 w-3 mr-1" />
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    )}
                </div>
            </div>

            {/* JSON Content */}
            <div className="p-4 max-h-96 overflow-auto">
                <div className="font-mono text-sm">
                    <JsonNode data={data} searchTerm={searchTerm} defaultExpanded={defaultExpanded} />
                </div>
            </div>
        </div>
    )
}
