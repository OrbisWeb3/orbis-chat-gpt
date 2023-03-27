import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Sidebar from "../components/Sidebar";
import Conversations from "../components/Conversations";
import ConversationDetails from "../components/ConversationDetails";
const inter = Inter({ subsets: ['latin'] })
import { Orbis, useOrbis, User } from "@orbisclub/components";

export default function Home() {
  const { orbis, user, setConnectModalVis } = useOrbis();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState();

  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">Decentralized Chat GPT  | Orbis</title>
        <meta property="og:title" content="Decentralized Chat GPT  | Orbis" key="og_title" />

        {/** Description */}
        <meta name="description" content="This is a decentralized version of Chat GPT built with Orbis. Conversations and Messages are encrypted with Lit Protocol and stored on Ceramic." key="description"></meta>
        <meta property="og:description" content="This is a decentralized version of Chat GPT built with Orbis. Conversations and Messages are encrypted with Lit Protocol and stored on Ceramic." key="og_description"/>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className="h-screen overflow-hidden flex items-center justify-center bg-[#edf2f7] w-full">
        <div className="flex flex-row h-screen antialiased text-gray-800 w-full">
           <div className="flex flex-row flex-shrink-0 bg-slate-50 border-r border-slate-200 p-4 w-[360px]">
              {/** Global playground sidebar on the left */}
              <Sidebar />

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
                <p className="text-center">
                  <button className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm" onClick={() => setConnectModalVis(true)}>Connect</button>
                </p>
              </div>
            }

        </div>
      </main>
    </>
  )
}
