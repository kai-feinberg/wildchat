import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
    return (
        <div className="flex flex-col justfiy-center lg:mx-20 sm:mx-4">
            <h1 className="text-6xl text-[#4e2a84]"> Willie the Wild-Chat</h1>
            <h2 className="text-gray-700 text-2xl">
                {" "}
                Wille knows every Northwestern resource! Whether you need career advice, mental health resources, or research opportunities, Willie
                can point you in the right direction{" "}
            </h2>
            <ChatWindow
                endpoint="api/chat"
                emptyStateComponent={<div></div>} // what to show when no messages are present
                showIngestForm={false} // lets you upload context to search through
                placeholder={"ie how can I reserve a room in tech?"}
                emoji="🐱‍👤"
                titleText="Willie the Wild-Chat"
            ></ChatWindow>
        </div>
    );
}
