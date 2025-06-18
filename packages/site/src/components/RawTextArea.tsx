import React, { useLayoutEffect, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

export const RawTextArea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ value, className, ...props }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useLayoutEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            readOnly
            value={value}
            className={`
                w-full box-border text-sm bg-dark text-gray-200
                font-iosevka -mb-1.5 rounded-lg
                border-2 border-gray-500 resize-none overflow-hidden
                focus:outline-none focus:border-white hover:border-white
                transition-colors duration-200
                scrollbar-hide ${className || ''}
            `}
            {...props}
        />
    );
};
