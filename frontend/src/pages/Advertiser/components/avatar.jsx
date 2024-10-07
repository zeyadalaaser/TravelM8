import React from "react";

export const Avatar = ({ children, className }) => (
  <div className={`rounded-full bg-gray-300 ${className}`}>{children}</div>
);

export const AvatarImage = ({ src, alt }) => (
  <img className="rounded-full object-cover w-full h-full" src={src} alt={alt} />
);

export const AvatarFallback = ({ children }) => (
  <div className="text-xl text-gray-600">{children}</div>
);
