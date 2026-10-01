"use client";

import { Bell, Menu, Search, User } from "lucide-react";

export function SchoolHeader({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button type="button" className="-m-2.5 p-2.5 text-slate-700 md:hidden">
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-slate-200 md:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        {title && (
          <h1 className="text-xl font-bold text-slate-800 tracking-tight ml-2">
            {title}
          </h1>
        )}
        <form className="relative flex flex-1 ml-auto max-w-md" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">Search students, classes...</label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm"
            placeholder="Search students, classes, or teachers..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profile dropdown stub */}
          <div className="flex items-center p-1.5 cursor-pointer">
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <User className="h-5 w-5" />
            </div>
            <span className="hidden lg:flex lg:items-center ml-3">
              <span className="text-sm font-semibold leading-6 text-slate-900" aria-hidden="true">
                School Admin
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
