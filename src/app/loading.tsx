"use client"

import React from "react";

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-t-blue-800"></div>
      <div className="ml-4 text-xl font-semibold text-gray-700">Cargando...</div>
    </div>
  );
}


export default Loading