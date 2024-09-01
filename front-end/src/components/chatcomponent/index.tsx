import { Box, Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { User } from "phosphor-react";
import { useState } from "react";

type Message = {
  text: string;
  sender: "me" | "them";
};

type ChatProps = {
  destinatario: {
    username: string | undefined;
    userid: string | undefined;
  };
  enviador: {
    username: string;
    userid: string;
  };
};

export function PrivateChat({ destinatario, enviador }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmitMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "me" }]);
      setNewMessage("");
    }
  };

  return (
    <Box bg="gray.900" w="100%" h="100vh" p={4}>
      <Flex bg="gray.800" p={4} alignItems="center">
        <Icon as={User} boxSize={8} color="purple.400" />
        <Text ml={2} color="white" fontWeight="bold" fontSize="lg">
          {destinatario.username}
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
        {messages.map((message, index) => (
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
