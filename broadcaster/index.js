import { connect, StringCodec } from "nats";

const nc = await connect({
  servers: "nats://my-nats.nats.svc.cluster.local:4222",
});

const sc = StringCodec();

const sendToDiscord = async (text) => {
  const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord returned ${response.status}`);
  }
};

const subscription = nc.subscribe("todos", {
  queue: "broadcaster",
});

console.log("Broadcaster listening for todo events");

for await (const message of subscription) {
  const data = JSON.parse(sc.decode(message.data));

  console.log("Received todo event:", data);

  await sendToDiscord(`Todo ${data.event}: ${data.todo.todo}`);
}
