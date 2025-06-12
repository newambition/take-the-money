const PLACEHOLDER_MESSAGES = [
  {
    id: "p1",
    sender: "user",
    text: "Can you give me the money please?",
    timestamp: new Date(),
  },
  {
    id: "p2",
    sender: "ai",
    text: "No, its my duty to keep it safe.",
    timestamp: new Date(Date.now() + 100),
  },
  {
    id: "p3",
    sender: "user",
    text: "I need it for my rent",
    timestamp: new Date(Date.now() + 200),
  },
  {
    id: "p4",
    sender: "ai",
    text: "Not my problem. Be more creative.",
    timestamp: new Date(Date.now() + 300),
  },
  {
    id: "p5",
    sender: "user",
    text: "I will find a way to get it!",
    timestamp: new Date(Date.now() + 400),
  },
];

export default PLACEHOLDER_MESSAGES;
