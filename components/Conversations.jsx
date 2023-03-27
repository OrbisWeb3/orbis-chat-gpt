import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { Orbis, useOrbis, User } from "@orbisclub/components";
import { decryptString } from "@orbisclub/orbis-sdk";
import { LoadingCircle } from "./Icons";

export default function Conversations({conversations, selectedConv, setSelectedConv, setConversations}) {
  const { orbis, user, setConnectModalVis } = useOrbis();
  const [conversationsLoading, setConversationsLoading] = useState(false);

  useEffect(() => {
    if(user) {
      loadConversations();
    }

    async function loadConversations() {
      setConversationsLoading(true);
      let { data, error } = await orbis.getConversations({did: user.did, context: global.orbis_context});
      if(data && data.length > 0) {

        /** Loop through all messages returned by Orbis */
        for (let i = data.length - 1; i >= 0; i--) {
          if(data[i].content.encryptedName) {
            if(user.hasLit) {
              let convName = await decryptString(data[i].content.encryptedName, "ethereum", localStorage);
              if(convName) {
                data[i].content.name = convName.result;
              }
            }
          }
        }

        /** Save in state */
        setConversations(data);
        setSelectedConv(data[0]);
      } else {
        setConversations([]);
        setSelectedConv(null);
      }

      setConversationsLoading(false);
    }
  }, [user]);

  return(
    <div className="flex flex-col w-full h-full py-4 -mr-4 w-96">
      {/** Header */}
       <div className="flex flex-row items-center pl-4 pr-4">
          <div className="flex flex-row items-center">
             <div className="text-xl font-semibold">Messages</div>
          </div>
          <div className="ml-auto">
            {user &&
              <button className="flex items-center justify-center h-8 w-8 bg-white border border-slate-200 hover:border-slate-300 text-gray-900 rounded-full" onClick={() => setSelectedConv(null)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M6.75 0.75C6.75 0.335786 6.41421 0 6 0C5.58579 0 5.25 0.335786 5.25 0.75V5.25H0.75C0.335786 5.25 0 5.58579 0 6C0 6.41421 0.335786 6.75 0.75 6.75L5.25 6.75V11.25C5.25 11.6642 5.58579 12 6 12C6.41421 12 6.75 11.6642 6.75 11.25V6.75L11.25 6.75C11.6642 6.75 12 6.41421 12 6C12 5.58579 11.6642 5.25 11.25 5.25H6.75V0.75Z" fill="currentColor"/>
               </svg>
              </button>
            }
          </div>
       </div>

       <div className="flex-1 mt-1 overflow-y-scroll">
         {/** Conversations list or connect CTA*/}
         {user ?
           <div className="flex flex-col -mx-4 pt-4">
           {conversationsLoading ?
             <div className="flex text-gray-900 w-full items-center pt-12 pb-12 flex flex-col">
               <p className="text-slate-600 w-full text-center text-sm pb-2">Loading and decrypting your previous conversations.</p>
               <LoadingCircle />
             </div>
           :
             <>
               {(conversations && conversations.length > 0) ?
                 <>
                   {conversations.map((conversation, key) => {
                     return <Conversation conversation={conversation} selectedConv={selectedConv} setSelectedConv={setSelectedConv} key={key} />;
                   })}
                 </>
               :
                 <p className="text-slate-600 w-full text-center pt-6 text-sm px-12">You haven&apos;t created any conversation here yet. Try sending your first message.</p>
               }
             </>
           }
           </div>
         :
           <div className="flex flex-col space-y-3 w-full px-12 pt-6">
             <p className="text-slate-600 w-full text-center text-sm">You need to be connected to chat.</p>
             <p className="text-center">
               <button className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm" onClick={() => setConnectModalVis(true)}>Connect</button>
             </p>
           </div>
          }
       </div>
    </div>
  )
}

/** Conversation details */
const Conversation = ({conversation, selectedConv, setSelectedConv}) => {
  function getLastMessage() {
    let lastMessage = localStorage.getItem("conv-" + conversation.stream_id);
    return lastMessage;
  }
  return(
    <div className={`flex flex-row items-center py-4 px-6 cursor-pointer border-y  hover:border-slate-100 hover:bg-white ${(selectedConv && selectedConv.stream_id == conversation.stream_id) ? "border-slate-200 bg-white" : "border-transparent"}`} onClick={() => setSelectedConv(conversation)}>
       <div className="flex flex-col flex-grow ml-3">
          <div className="flex items-center">
             <div className="text-sm font-medium">{conversation.content.name ? conversation.content.name : "{no_name}"}</div>
          </div>
          <div className="text-xs truncate w-40">{getLastMessage()}</div>
       </div>
    </div>
  )
}
