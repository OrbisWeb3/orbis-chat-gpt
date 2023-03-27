import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { initPrompt } from "../utils/ai";
import TextareaAutosize from 'react-textarea-autosize';
import { LoadingCircle, SendIcon } from "./Icons";

/** For Markdown support */
import { marked } from 'marked';

export default function MessageInput({ message, handleKeyDown, handleInputChange, submit, submitting }) {
  return(
    <>
      <div className="flex flex-row items-end w-full">
          <TextareaAutosize
            value={message}
            disabled={submitting}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`w-full border bg-white border border-slate-200 flex flex-1 w-full focus:outline-none text-sm flex items-center rounded-3xl min-h-12 px-5 py-3 ${submitting ? "bg-slate-100" : "bg-white" }`} placeholder="Type your message...." />
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
