import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { initPrompt } from "../utils/ai";
import TextareaAutosize from 'react-textarea-autosize';

/** For Markdown support */
import { marked } from 'marked';

export default function MessageInput({ message, handleKeyDown, handleInputChange, submit }) {
  return(
    <>
      <div className="flex flex-row items-end w-full">
          <TextareaAutosize
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border bg-white border border-slate-200 flex flex-1 w-full focus:outline-none text-sm flex items-center bg-white rounded-3xl min-h-12 px-5 py-3" placeholder="Type your message...." />
          <button className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white ml-3" onClick={() => submit()}>
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
          </button>
      </div>
    </>
  )
}
