'use client';

import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';

interface NumberInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    tooltip?: string;
    prefix?: string;
    placeholder?: string;
}

export const NumberInput = ({ label, value, onChange, tooltip, prefix, placeholder = '0' }: NumberInputProps) => {
    const [localValue, setLocalValue] = useState(value.toString());

    // Sync local state with prop value when prop value changes externally (and not focused? actually simpler to just sync)
    // But if we sync on every render, we lose the "local state" benefit if the parent re-renders.
    // We only want to sync if the prop value is significantly different (e.g. reset) or initial load.
    // For now, let's just initialize. If we need to support external updates while focused, it gets trickier.
    // A simple way: sync when `value` changes, BUT only if it doesn't match `parseFloat(localValue)`.

    useEffect(() => {
        if (parseFloat(localValue) !== value) {
            // Only update if the numeric value is actually different. 
            // This prevents "10." turning into "10" while typing.
            // But if user types "10.", parseFloat is 10. value is 10. No update. Good.
            // If user types "10.5", parseFloat is 10.5. value is 10.5. No update. Good.
            // If external reset happens (value becomes 0), local is "10.5". Update.
            setLocalValue(value === 0 && localValue === '' ? '' : value.toString());
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setLocalValue(newVal);

        // Optional: Live update if it's a valid number? 
        // The user complained about cursor jumping. This usually happens when the parent re-renders and passes back a formatted value.
        // If we don't call onChange immediately, the chart won't update live.
        // If we DO call onChange immediately, we must ensure the parent doesn't re-format the value passed back to us in a way that breaks the string.
        // But `value` prop is a number. So "10." becomes 10.
        // If we pass 10 back, parent passes 10 back. We see 10. We lose the decimal.
        // So we MUST NOT update `localValue` from `value` prop while typing.

        // We can call onChange live for the chart, but ignore the incoming `value` prop if we are focused.
        // Or just rely on the useEffect check above: `parseFloat("10.") === 10`. So if we send 10, and get back 10, we don't update localValue.

        const parsed = parseFloat(newVal);
        if (!isNaN(parsed)) {
            onChange(parsed);
        } else if (newVal === '') {
            onChange(0);
        }
    };

    const handleBlur = () => {
        // On blur, we can format it nicely if we want, or just leave it.
        // Let's ensure it matches the number.
        const parsed = parseFloat(localValue);
        if (!isNaN(parsed)) {
            setLocalValue(parsed.toString());
        } else {
            setLocalValue('0');
        }
    };

    return (
        <div>
            <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {label}
                </label>
                {tooltip && <Tooltip content={tooltip} />}
            </div>
            <div className="relative">
                {prefix && <span className="absolute left-3 top-2 text-zinc-500">{prefix}</span>}
                <input
                    type="text" // Use text to allow "10."
                    value={localValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none ${prefix ? 'pl-7' : ''}`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};
