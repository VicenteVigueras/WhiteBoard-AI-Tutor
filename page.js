import Image from "next/image";
import WhiteboardCanvas from "./component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4l font-bold mb-8">Whiteboard Drawing</h1>
      <WhiteboardCanvas />
    </main>
  );
}
