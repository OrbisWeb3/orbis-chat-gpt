import React, {useState, useEffect, useRef, useContext} from 'react';
import {Orbis, useOrbis, UserPfp, UserPopup} from "@orbisclub/components";
import {OrbisLogo, GithubIcon, TwitterIcon, LightModeIcon, DarkModeIcon} from "./Icons";
import useOutsideClick from "../hooks/useOutsideClick";
import Link from 'next/link'
import BackgroundWrapper from "./BackgroundWrapper";
import {useTheme} from "next-themes";

export default function Sidebar({showDiscussionPane, setShowDiscussionPane}) {
    const {orbis, user} = useOrbis();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        getLastTimeRead();

        async function getLastTimeRead() {
            /** Retrieve last post tiemstamp for this context */
            let {data, error} = await orbis.getContext(global.orbis_chat_context);

            /** Retrieve last read time for user */
            let last_read = localStorage.getItem(global.orbis_chat_context + "-last-read");
            if (last_read) {
                last_read = parseInt(last_read);
            } else {
                last_read = 0;
            }
            console.log("last_read:", last_read);
            console.log("data.last_post_timestamp:", data.last_post_timestamp);

            /** Show unread messages indicator if applicable */
            if (data && data.last_post_timestamp && (data.last_post_timestamp > last_read)) {
                setHasUnreadMessages(true);
            }
        }
    }, []);

    /** Open community chat and reset new message indicator */
    function openCommunityChat() {
        setShowDiscussionPane(true);
        setHasUnreadMessages(false);
    }

    return (
        <div className="relative flex flex-col items-center py-4 flex-shrink-0 w-20 bg-[#051224] rounded-3xl">
            <a href="#" className="flex items-center justify-center mt-1">
                <OrbisLogo/>
            </a>
            <ul className="flex flex-1 flex-col space-y-2 mt-6">
                <li>
                    <Link href="/" className="flex items-center">
                <span
                    className="flex items-center justify-center text-indigo-100 hover:bg-[#101d30] h-12 w-12 rounded-2xl">
                  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.25 11L10.2045 2.04549C10.6438 1.60615 11.3562 1.60615 11.7955 2.04549L20.75 11M3.5 8.75V18.875C3.5 19.4963 4.00368 20 4.625 20H8.75V15.125C8.75 14.5037 9.25368 14 9.875 14H12.125C12.7463 14 13.25 14.5037 13.25 15.125V20H17.375C17.9963 20 18.5 19.4963 18.5 18.875V8.75M7.25 20H15.5"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                    </Link>
                </li>

                <li>
                    <div className="flex items-center">
                <span
                    className="relative flex items-center justify-center text-indigo-100 hover:bg-[#101d30] h-12 w-12 rounded-2xl cursor-pointer"
                    onClick={() => openCommunityChat()}>
                  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M19.25 6.51104C20.1341 6.79549 20.75 7.6392 20.75 8.60822V12.8938C20.75 14.0304 19.9026 14.9943 18.7697 15.0867C18.4308 15.1144 18.0909 15.1386 17.75 15.1592V18.25L14.75 15.25C13.3963 15.25 12.0556 15.1948 10.7302 15.0866C10.4319 15.0623 10.1534 14.9775 9.90494 14.8451M19.25 6.51104C19.0986 6.46232 18.9393 6.43 18.7739 6.41628C17.4472 6.30616 16.1051 6.25 14.75 6.25C13.3948 6.25 12.0528 6.30616 10.7261 6.41627C9.59499 6.51015 8.75 7.47323 8.75 8.60821V12.8937C8.75 13.731 9.20986 14.4746 9.90494 14.8451M19.25 6.51104V4.63731C19.25 3.01589 18.0983 1.61065 16.4903 1.40191C14.4478 1.13676 12.365 1 10.2503 1C8.13533 1 6.05233 1.13678 4.00963 1.40199C2.40173 1.61074 1.25 3.01598 1.25 4.63738V10.8626C1.25 12.484 2.40173 13.8893 4.00964 14.098C4.58661 14.1729 5.16679 14.2376 5.75 14.2918V19L9.90494 14.8451"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                    {/** Show unread messages indicator if any */}
                    {hasUnreadMessages &&
                        <div className="bg-red-500 absolute h-2.5 w-2.5 rounded-full top-[7px] right-[7px]"></div>
                    }
                </span>
                    </div>
                </li>
                <li>
                    <div className="flex items-center">
                   <span
                       className="flex items-center justify-center text-indigo-100 hover:bg-[#101d30] h-12 w-12 rounded-2xl">
                       <button
                           aria-label="Toggle Dark Mode"
                           type="button"
                           className="w-10 h-10 p-3 rounded focus:outline-none"
                           onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                       >
                {theme === "dark" ? <LightModeIcon/> : <DarkModeIcon/>}
                    </button>
                   </span>
                    </div>
                </li>
            </ul>

            {/** External links */}
            <ul className="mb-3">
                <li>
                    <Link href="https://github.com/OrbisWeb3/orbis-chat-gpt" target="_blank"
                          className="flex items-center">
               <span
                   className="flex items-center justify-center text-indigo-100 hover:bg-[#101d30] h-12 w-12 rounded-2xl">
                 <GithubIcon/>
               </span>
                    </Link>
                </li>
                <li>
                    <Link href="https://twitter.com/useOrbis" target="_blank"
                          className="flex items-center">
               <span
                   className="flex items-center justify-center text-indigo-100 hover:bg-[#101d30] h-12 w-12 rounded-2xl">
                 <TwitterIcon/>
               </span>
                    </Link>
                </li>
            </ul>

            {/** Show connected user on bottom left */}
            {user &&
                <div className="cursor-pointer flex" onClick={() => setShowUserMenu(true)}>
                    <UserPfp details={user}/>
                </div>
            }

            {/** Showing user menu */}
            {showUserMenu &&
                <UserMenuVertical hide={() => setShowUserMenu(false)}/>
            }
        </div>
    )
}

/** User menu with update profile and logout buttons */
const UserMenuVertical = ({hide}) => {
    const {orbis, user, setUser, setConnectModalVis} = useOrbis();
    const [showUserPopup, setShowUserPopup] = useState(false);
    const wrapperRef = useRef(null);

    /** Is triggered when clicked outside the component */
    useOutsideClick(wrapperRef, () => hide());

    async function logout() {
        let res = await orbis.logout();
        setUser(null);
        hide();
    }

    return (
        <>
            <div className="absolute bottom-[0px] left-[50px] py-10 z-50 w-[165px]">
                <div
                    className="text-sm shadow-md bg-white border border-gray-200 p-3 rounded-md flex flex-col w-full space-y-1"
                    ref={wrapperRef}>
                    <div className="text-primary font-medium hover:bg-gray-50 cursor-pointer rounded py-1.5 px-2"
                         onClick={() => setShowUserPopup(true)}>Update profile
                    </div>
                    <div className="text-primary font-medium hover:bg-gray-50 cursor-pointer rounded py-1.5 px-2"
                         onClick={() => logout()}>Logout
                    </div>

                    {showUserPopup &&
                        <BackgroundWrapper hide={() => setShowUserPopup(false)}>
                            <div className="flex pointer-events-auto w-screen justify-center">
                                <UserPopup details={user} position="relative"/>
                            </div>
                        </BackgroundWrapper>
                    }
                </div>
            </div>
        </>
    )
}
