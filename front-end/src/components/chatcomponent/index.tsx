import socket from "@/domain/socket";
import { sendMessages } from "@/gateway/messages";
import { Box, Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { User } from "phosphor-react";
import { useEffect, useState } from "react";

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

       const sendMessage = await sendMessages(
          enviador.sender,
          destinatario.friend,
          newMessage,
       )
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data: any) => {
      if (data.sender === destinatario.friend) {
        const updatedMessages = [
          ...(messages[data.sender] || []),
          { text: data.content, sender: "them", timestamp: data.timestamp },
        ];
        setMessages({
          ...messages,
          [data.sender]: updatedMessages,
        });
      }
    };

    socket.on("message-received", handleReceiveMessage);

    return () => {
      socket.off("message-received", handleReceiveMessage);
    };
  }, [messages, destinatario.friend]);

  const currentMessages = messages[destinatario.friend || ""] || [];

  return (
    <Box bg="gray.900" w="100%" h="100vh" p={4}>
      <Flex bg="gray.800" p={4} alignItems="center">
        <Icon as={User} boxSize={8} color="purple.400" />
        <Text ml={2} color="white" fontWeight="bold" fontSize="lg">
          {destinatario.friend}
        </Text>
      </Flex>

      <Box
        bg="gray.800"
        flex="1"
        mt={4}
        borderRadius="md"
        p={4}
        overflowY="auto"
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
