import React from "react";

export const LoadingCircle = ({style}) => {
    return (
        <svg className="animate-spin -ml-1 h-5 w-5 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             style={style}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}

export const OrbisLogo = ({width = "31", height = "41"}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 40 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="#fff" stroke-width="3.4"/>
            <circle cx="20" cy="39.1304" r="11.0435" stroke="#fff" stroke-width="3.4"/>
        </svg>
    );
}

export const MenuDots = () => {
    return (
        <svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M2 0C2.82843 0 3.5 0.671573 3.5 1.5C3.5 2.32843 2.82843 3 2 3C1.17157 3 0.5 2.32843 0.5 1.5C0.5 0.671573 1.17157 0 2 0Z"
                fill="currentColor"/>
            <path
                d="M2 5.5C2.82843 5.5 3.5 6.17157 3.5 7C3.5 7.82843 2.82843 8.5 2 8.5C1.17157 8.5 0.5 7.82843 0.5 7C0.5 6.17157 1.17157 5.5 2 5.5Z"
                fill="currentColor"/>
            <path
                d="M3.5 12.5C3.5 11.6716 2.82843 11 2 11C1.17157 11 0.5 11.6716 0.5 12.5C0.5 13.3284 1.17157 14 2 14C2.82843 14 3.5 13.3284 3.5 12.5Z"
                fill="currentColor"/>
        </svg>
    )
}

export const TwitterIcon = () => {
    return (
        <svg className="h-9 w-9 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z"/>
        </svg>
    )
}

export const GithubIcon = () => {
    return (
        <svg className="h-10 w-10 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M16 8.2c-4.4 0-8 3.6-8 8 0 3.5 2.3 6.5 5.5 7.6.4.1.5-.2.5-.4V22c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.3 1.9.9 2.3.7.1-.5.3-.9.5-1.1-1.8-.2-3.6-.9-3.6-4 0-.9.3-1.6.8-2.1-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8.6-.2 1.3-.3 2-.3s1.4.1 2 .3c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.1 0 3.1-1.9 3.7-3.7 3.9.3.4.6.9.6 1.6v2.2c0 .2.1.5.6.4 3.2-1.1 5.5-4.1 5.5-7.6-.1-4.4-3.7-8-8.1-8z"/>
        </svg>
    )
}

export const SendIcon = () => {
    return (
        <svg
            className="w-5 h-5 transform rotate-90 -mr-px"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8">
            </path>
        </svg>
    )
}

export const DarkModeIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            className="w-4 h-4 text-white dark:text-white"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
        </svg>
    )
}
export const LightModeIcon = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            className="w-4 h-4 text-white dark:text-white"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
        </svg>
    )
}