import Marquee from "react-fast-marquee";

const messages = [
  "Bli med på Launch Party denne fredagen!",
  "Be there or be square!",
  "Vi gleder oss til å se deg!",
];

const divider = "🎉";

const targetDate = new Date("2024-02-09T20:00:00");

export function PartyNotification() {
  if (new Date() > targetDate) {
    return null;
  }

  const messageList = messages.map((message) => [message, divider]).flat();

  return (
    <div className="flex items-center justify-center border-b bg-background py-2 text-foreground">
      <Marquee speed={40} autoFill>
        {messageList.map((message) => (
          <p key={message} className="px-4 text-sm">
            {message}
          </p>
        ))}
      </Marquee>
    </div>
  );
}
