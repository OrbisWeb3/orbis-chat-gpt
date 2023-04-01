import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { initPrompt } from "../utils/ai";
import TextareaAutosize from 'react-textarea-autosize';
import { LoadingCircle, SendIcon } from "./Icons";
import { Orbis, useOrbis, User, AccessRulesModal, checkContextAccess } from "@orbisclub/components";

/** For Markdown support */
import { marked } from 'marked';

export default function MessageInput({ message, handleKeyDown, handleInputChange, submit, submitting, commandMenu }) {
  return(
    <>
      <div className="flex flex-row items-end w-full relative">
          {/** Command menu */}
          {commandMenu &&
            <CommandMenuVertical />
          }

          {/** Text-area */}
          <TextareaAutosize
            value={message}
            disabled={submitting}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`w-full border bg-white border border-slate-200 focus:border-sky-500 flex flex-1 w-full focus:outline-none text-sm flex items-center rounded-3xl min-h-12 px-5 py-3 dark:bg-[#041b3b] dark:text-white dark:focus:border-sky-900 ${submitting ? "bg-slate-100" : "bg-white" }`} placeholder="Type your message...." />
          <button className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white ml-3" onClick={() => submit()}>
            {submitting ?
              <LoadingCircle/>
            :
              <SendIcon />
            }

          </button>
      </div>
    </>
  )
}


/** User menu with update profile and logout buttons */
const CommandMenuVertical = ({hide}) => {
  const { orbis, user, setUser, setConnectModalVis } = useOrbis();

  async function logout() {
    let res = await orbis.logout();
    setUser(null);
    hide();
  }

  return(
    <>
      <div className="absolute bottom-[0px] left-[0px] py-10 z-50 w-[165px]">
        <div className="text-sm shadow-md bg-white border border-gray-200 p-3 rounded-md flex flex-col w-full space-y-1" >
          <div className="text-primary font-medium hover:bg-gray-50 cursor-pointer rounded py-1.5 px-2" onClick={() => console.log(true)}>/fetch</div>
        </div>
      </div>
    </>
  )
}
