import React from 'react';
import clsx from 'clsx';

// Base Table Component
export const Table = ({ children, className }) => (
  <div className={clsx("overflow-x-auto w-full", className)}>
    <table className="w-full text-left border-collapse">{children}</table>
  </div>
);

// Table Header Component
export const TableHeader = ({ children, className }) => (
  <thead className={clsx("bg-gray-100", className)}>
    {children}
  </thead>
);

// Table Row Component
export const TableRow = ({ children, className }) => (
  <tr className={clsx("border-b last:border-none hover:bg-gray-50", className)}>
    {children}
  </tr>
);

// Table Head Component (for individual column headers)
export const TableHead = ({ children, className }) => (
  <th className={clsx("px-4 py-2 text-sm font-semibold text-gray-700", className)}>
    {children}
  </th>
);

// Table Body Component
export const TableBody = ({ children, className }) => (
  <tbody className={clsx("divide-y", className)}>
    {children}
  </tbody>
);

// Table Cell Component (for individual table cells)
export const TableCell = ({ children, className }) => (
  <td className={clsx("px-4 py-2 text-sm text-gray-600", className)}>
    {children}
  </td>
);
