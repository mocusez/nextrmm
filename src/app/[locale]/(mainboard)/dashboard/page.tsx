import { Counter } from "~/components/counter";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <p>Hello</p>
      <Counter />
    </div>
  );
}
