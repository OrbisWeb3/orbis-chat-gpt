import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Sidebar from "../components/Sidebar";
import Conversations from "../components/Conversations";
import ConversationDetails from "../components/ConversationDetails";
import BackgroundWrapper from "../components/BackgroundWrapper";

const inter = Inter({ subsets: ['latin'] })
import { Orbis, useOrbis, User, Chat } from "@orbisclub/components";

export default function Home() {
  const { orbis, user, setConnectModalVis } = useOrbis();
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
           {process.env.NEXT_PUBLIC_OPEN_AI_KEY ?
             <>
             {user ?
               <ConversationDetails
                  conversations={conversations}
                  setConversations={setConversations}
                  setSelectedConv={setSelectedConv}
                  selectedConv={selectedConv} />
             :
                <div className="flex flex-col space-y-3 w-full">
                  <p className="text-slate-600 w-full text-center pt-12 text-sm">You need to be connected to chat.</p>
                  <p className="text-center">
                    <button className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm" onClick={() => setConnectModalVis(true)}>Connect</button>
                  </p>
                </div>
              }
             </>
           :
           <div className="flex flex-col space-y-3 w-full">
             <p className="text-slate-600 w-full text-center pt-12 text-sm">Congratulations on forking this repository! <br/>You now need to use your own Open AI API key in the <b>NEXT_PUBLIC_OPEN_AI_KEY</b> environment variable.</p>
           </div>
          }
        </div>

        {/** Show community pane */}
        {showDiscussionPane &&
          <BackgroundWrapper hide={() => setShowDiscussionPane(false)}>
            <div className="h-full w-[610px] max-w-[90%] absolute right-[0px] bg-white border-l border-slate-400">
              <Chat context="kjzl6cwe1jw14bixqvv1zj647a707e962fc39awh749lok3ivo3tfog1o2n44zd" />
            </div>
          </BackgroundWrapper>
        }
      </main>
    </>
  )
}
