import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import Head from 'next/head'
import { Inter } from 'next/font/google'
import Sidebar from "../components/Sidebar";
import Conversations from "../components/Conversations";
import ConversationDetails from "../components/ConversationDetails";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { LoadingCircle } from "../components/Icons";

const inter = Inter({ subsets: ['latin'] })
import { useOrbis, Chat } from "@orbisclub/components";

export default function Home() {
  const { user, connecting, setConnectModalVis } = useOrbis();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState();
  const [showDiscussionPane, setShowDiscussionPane] = useState(false);

  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">Decentralized ChatGPT  | Orbis</title>
        <meta property="og:title" content="Decentralized ChatGPT  | Orbis" key="og_title" />

        {/** Description */}
        <meta name="description" content="This is a decentralized version of ChatGPT built with Orbis. Conversations and Messages are encrypted with Lit Protocol and stored on Ceramic." key="description"></meta>
        <meta property="og:description" content="This is a decentralized version of ChatGPT built with Orbis. Conversations and Messages are encrypted with Lit Protocol and stored on Ceramic." key="og_description"/>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content="https://ai.useorbis.com/twitter-og.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="h-screen overflow-hidden flex items-center justify-center bg-[#edf2f7] w-full">
        <div className="flex flex-row h-screen antialiased text-gray-800 w-full">
           <div className="hidden md:flex flex-row flex-shrink-0 bg-slate-50 border-r border-slate-200 p-4 w-[360px]">
              {/** Global playground sidebar on the left */}
              <Sidebar setShowDiscussionPane={setShowDiscussionPane} />

              {/** List of conversations if user is connected */}
              <Conversations
                conversations={conversations}
                setConversations={setConversations}
                selectedConv={selectedConv}
                setSelectedConv={setSelectedConv} />
           </div>

           {/** Conversation container */}
           {user ?
             <ConversationDetails
                conversations={conversations}
                setConversations={setConversations}
                setSelectedConv={setSelectedConv}
                selectedConv={selectedConv} />
           :
              <div className="flex flex-col space-y-3 w-full">
                <p className="text-slate-600 w-full text-center pt-12 text-sm">You need to be connected to chat.</p>
                <p className="text-center flex justify-center">
                  {connecting ?
                    <button className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm flex flex-row items-center"><LoadingCircle style={{marginRight: 8}}/> Connecting</button>
                  :
                    <button className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm" onClick={() => setConnectModalVis(true)}>Connect</button>
                  }
                </p>
              </div>
            }
        </div>

        {/** Show community pane */}
        {showDiscussionPane &&
          <BackgroundWrapper hide={() => setShowDiscussionPane(false)}>
            <div className="flex h-full w-[610px] max-w-[90%] absolute right-[0px] bg-white flex-col">
              <div className="flex bg-[#051224] py-6 px-4 sm:px-6 flex-col">
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-medium text-white" id="slide-over-title">Public Community Feed</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button type="button" className="rounded-md bg-transparent text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white" onClick={() => setShowDiscussionPane(false)}>
                      <span className="sr-only">Close panel</span>
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-[#C6CAD2]">Chat with our community about your experience using our decentralized version of ChatGPT.</p>
                </div>
              </div>
              <div className="flex flex-1 overflow-y-scroll">
                <Chat context={global.orbis_chat_context} />
              </div>
            </div>
          </BackgroundWrapper>
        }
      </main>
    </>
  )
}
