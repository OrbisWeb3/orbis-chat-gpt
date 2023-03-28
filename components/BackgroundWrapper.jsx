import React, { useState, useEffect, useRef, useContext } from 'react';
import useOutsideClick from "../hooks/useOutsideClick";

/** Background wrapper used to surround modals or side panels */
export default function BackgroundWrapper({hide, children}) {
  const wrapperRef = useRef(null);

  /** Is triggered when clicked outside the component */
  useOutsideClick(wrapperRef, () => hide());
  return(
    <div className="relative z-100" aria-labelledby="slide-over-title" role="dialog" aria-modal="true" style={{zIndex: 100}}>
      <div className="fixed inset-0 overflow-hidden">
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity bg-blur cursor-pointer" onClick={() => hide()}></div>
        {children}
      </div>
    </div>
  )
}
