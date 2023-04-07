import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function ConversationSettings({personas, setPersonas}) {
  async function save() {
    console.log("Saving");
  }

  return(
    <div className="h-full w-[410px] absolute right-[0px] bg-white border-l border-slate-400 py-8 overflow-y-scroll">
      <div className="flex flex-col px-6 space-y-2">
      <p className="text-gray-900 bg-slate-50 border border-dashed border-slate-200 p-6 rounded-md text-sm">Conversation settings are coming soon.</p>
      {/**
        <p className="text-gray-900 font-medium">AI Personas</p>
        {personas.map((persona, key) => {
          return(
            <PersonaSettings persona={persona} personas={personas} setPersonas={setPersonas} id={key} key={key} />
          )
        })}
        <div className="bg-white px-3 py-2 border border-slate-300 border-dashed rounded-md text-sm">
          <p className="text-gray-900 cursor-pointer hover:underline font-medium">+ Add persona</p>
        </div>
        <button className="btn bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white rounded font-medium text-sm" onClick={() => save()}>Save</button>
        */}
      </div>
    </div>
  )
}

const PersonaSettings = ({id, persona, personas, setPersonas}) => {
  const [viewSettings, setViewSettings] = useState(false);
  const [label, setLabel] = useState(persona.label);
  const [systemPrompt, setSystemPrompt] = useState(persona.content);

  /** Save new personas in state */
  function save() {
    let _personas = [...personas];
    _personas[id] = {
      label: label, content: systemPrompt
    }
    setPersonas(_personas);
    setViewSettings(false);
  }

  return(
    <div className="bg-white px-3 py-2 border border-slate-300 rounded-md text-sm">
      {/** Show persona name or settings */}
      {viewSettings ?
        <div className="flex flex-col space-y-2 p-2">
          <div>
            <p className="text-sm font-medium text-gray-900 text-left">Persona&apos;s label:</p>
            <input type="text" className="mt-1 px-2 py-1.5 flex w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Enter label" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 text-left">Persona&apos;s rules:</p>
            <TextareaAutosize className="mt-1 px-2 py-1.5 flex w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm bg-white" value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Enter rules for this persona" rows="5" />
          </div>
          <div className="font-medium hover:underline text-blue-800 cursor-pointer w-full text-center" onClick={() => save()}>Save</div>
        </div>
      :
        <p className="cursor-pointer hover:underline font-medium text-gray-900" onClick={() => setViewSettings(true)}>{persona.label}</p>
      }

    </div>
  )
}
