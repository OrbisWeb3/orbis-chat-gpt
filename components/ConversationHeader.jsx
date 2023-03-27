export default function ConversationHeader() {
  return(
    <div className="flex flex-row items-center py-4 px-6 rounded-2xl bg-slate-50 border border-slate-200">
       <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-100">
          T
       </div>
       <div className="flex flex-col ml-3">
          <div className="font-semibold text-sm">UI Art Design</div>
          <div className="text-xs text-gray-500">Active</div>
       </div>
       <div className="ml-auto">
          <ul className="flex flex-row items-center space-x-2">
             <li>
                <a href="#" className="flex items-center justify-center bg-white border border-slate-200 hover:border-slate-300 text-gray-900 h-10 w-10 rounded-full">
                   <span>
                      <svg className="w-5 h-5"
                         fill="none"
                         stroke="currentColor"
                         viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                         <path stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                      </svg>
                   </span>
                </a>
             </li>
          </ul>
       </div>
    </div>
  )
}
