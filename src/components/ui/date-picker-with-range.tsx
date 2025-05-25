"use client"
import React, { useEffect } from "react"
import { format, previousMonday, startOfMonth, startOfWeek, startOfYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { vi } from "date-fns/locale";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    onDateChange?: (date: DateRange | undefined) => void; // Add callback prop
}

export function DatePickerWithRange({
    className,
    onDateChange,
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: startOfWeek(new Date()),
        to: new Date(),
    });

    // Notify parent component when date changes
    useEffect(() => {
        onDateChange?.(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd/MM/y")} -{" "}
                                    {format(date.to, "dd/MM/y")}
                                </>
                            ) : (
                                format(date.from, "dd/MM/y")
                            )
                        ) : (
                            <span>Chọn khoảng thời gian</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                    <Select
                        onValueChange={(value) => {
                            switch (value) {
                                case "0":
                                    setDate({
                                        from: previousMonday(new Date()),
                                        to: new Date(),
                                    })
                                    break
                                case "1":
                                    setDate({
                                        from: startOfMonth(new Date()),
                                        to: new Date(),
                                    })
                                    break
                                case "2":
                                    setDate({
                                        from: startOfYear(new Date()),
                                        to: new Date(),
                                    })
                                    break
                            }
                        }
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn khoảng thời gian" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectItem value="0">Theo tuần</SelectItem>
                            <SelectItem value="1">Theo tháng</SelectItem>
                            <SelectItem value="2">Theo năm</SelectItem>
                        </SelectContent>
                    </Select>

                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                        }
                        locale={vi}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
