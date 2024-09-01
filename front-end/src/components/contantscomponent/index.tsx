"use client";

import { addfriends, getAllfriends, getPendentRequest } from "@/gateway/friends";
import { Box, Button, Flex, Icon, Input, Text, VStack } from "@chakra-ui/react";
import { CheckCircle, User, UserPlus, Users, XCircle } from "phosphor-react";
import { useEffect, useState } from "react";

type FriendRequest = {
  friend: string;
  me: string;
};

interface ContactComponentProps {
  onContactClick: (contact: FriendRequest) => void;
}

export function ContactComponent({ onContactClick }: ContactComponentProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<FriendRequest[]>([]);
  const [newRequest, setNewRequest] = useState("");
  const [activeSection, setActiveSection] = useState<"friends" | "addFriend" | "pendingRequests">("friends");

  useEffect(() => {
    const storedAccount = localStorage.getItem("username");
    if(!storedAccount) return
    setAccount(storedAccount);
  }, []);

  useEffect(() => {
    if (account) {
      listFriendsOnLoad(account);
      listPendentRequest(account);
    }
  }, [account]);

  const listFriendsOnLoad = async (userId: string): Promise<void> => {
    const list = await getAllfriends(userId);
    setFriends(list);
  };

  const listPendentRequest = async (userId: string): Promise<void> => {
    const list: any = await getPendentRequest(userId);
    for(let i in list) {
      console.log(list[i])
    }
    if(!list) return
    setPendingRequests(list);
  };

  const handleSendRequest = async (): Promise<void> => {
    if (!account || !newRequest) return;
    const newfriend = await addfriends(account, newRequest);
    console.log(newfriend);
    // Opcionalmente, você pode atualizar a lista de amigos ou fazer outra ação aqui
  };

  const handleAcceptRequest = async (friend: string): Promise<void> => {
    if (!account) return;
    const newfriend = await addfriends(account, friend);
    console.log(newfriend);
    // Atualizar lista de amigos
    listFriendsOnLoad(account);
  };

  const handleRejectRequest = (userid: string) => {
    console.log(`Pedido de amizade de ${userid} rejeitado`);
    // Aqui você pode implementar a lógica para remover a solicitação da lista
  };

  return (
    <Box bg="gray.900" w="100%" h="100vh" p={4}>
      <Flex bg="gray.800" p={4} alignItems="center" justify="space-between">
        <Flex alignItems="center">
          <Icon as={User} boxSize={8} color="purple.400" />
          <Text ml={2} color="white" fontWeight="bold" fontSize="lg">
            Contatos
          </Text>
        </Flex>
        <Flex>
          <Button
            colorScheme={activeSection === "friends" ? "purple" : "gray"}
            onClick={() => setActiveSection("friends")}
            leftIcon={<Users size={20} />}
            mr={2}
          >
            Amigos
          </Button>
          <Button
            colorScheme={activeSection === "addFriend" ? "purple" : "gray"}
            onClick={() => setActiveSection("addFriend")}
            leftIcon={<UserPlus size={20} />}
            mr={2}
          >
            Adicionar
          </Button>
          <Button
            colorScheme={activeSection === "pendingRequests" ? "purple" : "gray"}
            onClick={() => setActiveSection("pendingRequests")}
            leftIcon={<CheckCircle size={20} />}
          >
            Convites
          </Button>
        </Flex>
      </Flex>

      {activeSection === "friends" && (
        <Box bg="gray.800" mt={4} borderRadius="md" p={4}>
          <Text color="white" mb={2} fontWeight="bold">
            Seus amigos
          </Text>
          <VStack spacing={3} align="stretch">
            {friends.map((friend) => (
              <Flex
                key={friend.friend}
                justify="space-between"
                align="center"
                bg="gray.700"
                p={3}
                borderRadius="md"
                onClick={() => onContactClick(friend)}
                cursor="pointer"
              >
                <Flex align="center">
                  <Icon as={User} boxSize={6} color="purple.400" />
                  <Text ml={2} color="white">
                    {friend.friend}
                  </Text>
                </Flex>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}

      {activeSection === "addFriend" && (
        <Box bg="gray.800" mt={4} borderRadius="md" p={4}>
          <Text color="white" mb={2} fontWeight="bold">
            Enviar pedido de amizade
          </Text>
          <Flex>
            <Input
              placeholder="Digite o username..."
              value={newRequest}
              onChange={(e) => setNewRequest(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _placeholder={{ color: "gray.400" }}
              borderRadius="md"
              mr={2}
            />
            <Button onClick={handleSendRequest} colorScheme="purple" leftIcon={<UserPlus size={20} />}>
              Enviar
            </Button>
          </Flex>
        </Box>
      )}

      {activeSection === "pendingRequests" && (
        <Box bg="gray.800" mt={4} borderRadius="md" p={4}>
          <Text color="white" mb={2} fontWeight="bold">
            Pedidos de amizade pendentes
          </Text>
          <VStack spacing={3} align="stretch">
            {pendingRequests.map((request) => (
              <Flex
                key={request.me}
                justify="space-between"
                align="center"
                bg="gray.700"
                p={3}
                borderRadius="md"
              >
                <Flex align="center">
                  <Icon as={User} boxSize={6} color="purple.400" />
                  <Text ml={2} color="white">
                    {request.me}
                  </Text>
                </Flex>
                <Flex>
                  <Icon
                    as={CheckCircle}
                    boxSize={6}
                    color="green.400"
                    cursor="pointer"
                    onClick={() => handleAcceptRequest(request.me)}
                    mr={2}
                  />
                  <Icon
                    as={XCircle}
                    boxSize={6}
                    color="red.400"
                    cursor="pointer"
                    onClick={() => handleRejectRequest(request.account_id)}
                  />
                </Flex>
              </Flex>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
}
