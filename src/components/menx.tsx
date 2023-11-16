"use client";

import { useState } from "react";

export function Best({ className }: React.HTMLAttributes<HTMLElement>) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
