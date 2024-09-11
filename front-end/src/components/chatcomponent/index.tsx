import socket from "@/domain/socket";
import { getMessages, sendMessages } from "@/gateway/messages";
import { Box, Button, Flex, Icon, Input, Text, Badge } from "@chakra-ui/react";
import { User } from "phosphor-react";
import { useEffect, useRef, useState } from "react";

type Message = {
  text: string;
  sender: "me" | "them";
  timestamp: string;
};

type ChatProps = {
  destinatario: {
    friend: string | undefined;
  };
  enviador: {
    sender: string;
  };
};

export function PrivateChat({ destinatario, enviador }: ChatProps) {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [newMessage, setNewMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasFetchedMessages = useRef(false);

  const handleSubmitMessage = async () => {
    if (newMessage.trim() !== "") {
      const updatedMessages = [
        ...(messages[destinatario.friend || ""] || []),
        { text: newMessage, sender: "me", timestamp: new Date().toLocaleTimeString() },
      ];

      if (!destinatario.friend) return;

      setMessages({
        ...messages,
        [destinatario.friend || ""]: updatedMessages,
      });
      setNewMessage("");
      socket.emit("send-message", {
        recipient: destinatario.friend,
        sender: enviador.sender,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      });

      await sendMessages(enviador.sender, destinatario.friend, newMessage);
    }
  };

  const getOldMessagesFromChat = async () => {
    if (!destinatario.friend || hasFetchedMessages.current) return;

    hasFetchedMessages.current = true;
    const oldMessages = await getMessages(enviador.sender, destinatario.friend);

    const formattedMessages = oldMessages.map((msg: any) => ({
      text: msg.messageContent,
      sender: msg.senderUsername === enviador.sender ? "me" : "them",
      timestamp: new Date(msg.date).toLocaleTimeString(),
    }));

    setMessages((prevMessages) => ({
      ...prevMessages,
      [destinatario.friend as string]: formattedMessages,
    }));
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      if (data.sender === destinatario.friend) {
        setMessages((prevMessages) => {
          const updatedMessages = [
            ...(prevMessages[data.sender] || []),
            { text: data.content, sender: "them", timestamp: data.timestamp },
          ];

          return {
            ...prevMessages,
            [data.sender]: updatedMessages,
          };
        });
      } else {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.sender]: (prev[data.sender] || 0) + 1,
        }));
      }
    };

    socket.on("message-received", handleReceiveMessage);

    return () => {
      socket.off("message-received", handleReceiveMessage);
    };
  }, [destinatario.friend]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    getOldMessagesFromChat();
  }, [destinatario.friend]);

  const currentMessages = messages[destinatario.friend || ""] || [];

  return (
    <Box bg="gray.900" w="100%" h="100vh" p={4}>
      <Flex bg="gray.800" p={4} alignItems="center">
        <Icon as={User} boxSize={8} color="purple.400" />
        <Text ml={2} color="white" fontWeight="bold" fontSize="lg">
          {destinatario.friend}
        </Text>
        {unreadMessages[destinatario.friend || ""] > 0 && (
          <Badge ml={2} colorScheme="red">
            {unreadMessages[destinatario.friend || ""]} novas
          </Badge>
        )}
      </Flex>

      <Box
        bg="gray.800"
        flex="1"
        mt={4}
        borderRadius="md"
        p={4}
        overflowY="auto"
        ref={chatContainerRef}
        maxH="70vh"
      >
        {currentMessages.map((message, index) => (
          <Flex
            key={index}
            justify={message.sender === "me" ? "flex-end" : "flex-start"}
            mb={2}
          >
            <Box
              bg={message.sender === "me" ? "gray.700" : "gray.600"}
              color="white"
              p={3}
              borderRadius="md"
              maxW="70%"
            >
              {message.text}
            </Box>
          </Flex>
        ))}
      </Box>

      <Flex mt={4} as="form" onSubmit={(e) => { e.preventDefault(); handleSubmitMessage(); }}>
        <Input
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          bg="gray.700"
          borderColor="gray.600"
          color="white"
          _placeholder={{ color: "gray.400" }}
          borderRadius="md"
          mr={2}
        />
        <Button type="submit" colorScheme="purple">
          Enviar
        </Button>
      </Flex>
    </Box>
  );
}
