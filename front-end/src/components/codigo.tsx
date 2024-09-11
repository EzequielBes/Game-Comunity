"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Avatar,
  List,
  ListItem,
  IconButton,
} from '@chakra-ui/react';
import { getAllfriends, getPendentRequest, addfriends } from '@/api/friends';
import { PrivateChat } from '@/components/chatcomponent';

const socket = io('http://localhost:3005');

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [newContact, setNewContact] = useState<string>('');
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const storedAccountId = localStorage.getItem('account_id');
    setAccountId(storedAccountId);
  }, []);

  useEffect(() => {
    if (accountId) {
      socket.emit('registerAccountId', accountId);
      socket.on('receiveMessage', (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      const fetchFriends = async () => {
        try {
          const friends = await getAllfriends(accountId);
          setContacts(friends.output || []);
        } catch (error) {
          console.error('Error fetching friends:', error);
          setContacts([]);
        }
      };

      fetchFriends();
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      const fetchPendingRequests = async () => {
        try {
          const requests = await getPendentRequest(accountId);
          console.log('Pending Requests Data:', requests); // Log para verificar a resposta da API

          // Verificando se requests é um array
          if (Array.isArray(requests)) {
            setPendingRequests(requests);
          } else {
            console.error('Pending requests data is not an array:', requests);
            setPendingRequests([]);
          }
        } catch (error) {
          console.error('Error fetching pending requests:', error);
          setPendingRequests([]);
        }
      };

      fetchPendingRequests();
    }
  }, [accountId]);

  const handleSend = () => {
    if (input.trim()) {
      socket.emit('sendMessage', input);
      setInput('');
    }
  };

  const handleAddContact = async () => {
    if (newContact.trim() && accountId) {
      try {
        if (!contacts.find(contact => contact.username === newContact.trim())) {
          await addfriends(accountId, newContact.trim());
          setContacts((prevContacts) => [...prevContacts, { username: newContact.trim() }]);
        } else {
          console.error('Contact already added');
        }
        setNewContact('');
      } catch (error) {
        console.error('Error adding friend:', error);
      }
    } else if (!accountId) {
      console.error('User is not logged in');
    }
  };

  return (
    <Flex direction="row" h="100vh" p={4} bg="gray.100">
      <Flex direction="column" w="300px" bg="white" borderRadius="md" boxShadow="md" mr={4}>
        <Box p={4} borderBottom="1px" borderColor="gray.200" bg="blue.500" color="white">
          <HStack justify="space-between">
            <Text fontWeight="bold">Contacts</Text>
            <IconButton
              aria-label="Add contact"
              colorScheme="teal"
              variant="ghost"
              onClick={handleAddContact}
            />
          </HStack>
        </Box>
        <Box p={4} borderBottom="1px" borderColor="gray.200">
          <HStack>
            <Input
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              placeholder="Add friend by username..."
              borderRadius="full"
              bg="white"
              boxShadow="sm"
            />
            <Button
              onClick={handleAddContact}
              colorScheme="blue"
              borderRadius="full"
              px={4}
            >
              Add
            </Button>
          </HStack>
        </Box>
        <Box p={4} borderBottom="1px" borderColor="gray.200" bg="blue.50" color="black">
          <Text fontWeight="bold" mb={2}>Pending Friend Requests</Text>
          <List spacing={3}>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request, index) => (
                <ListItem key={index} p={2} borderRadius="md" _hover={{ bg: "gray.100" }} cursor="pointer">
                  <HStack>
                    <Avatar size="sm" name={request.username.value} src={`https://bit.ly/dan-abramov?index=${index}`} />
                    <Text color="black">{request.username.value}</Text>
                  </HStack>
                </ListItem>
              ))
            ) : (
              <Text>No pending requests</Text>

            )}
          </List>
        </Box>
        <Box p={4}>
          <Text fontWeight="bold" mb={2}>Contacts</Text>
          <List spacing={3}>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <ListItem key={index} p={2} borderRadius="md" _hover={{ bg: "gray.100" }} cursor="pointer">
                  <HStack>
                    <Avatar size="sm" name={contact.username} src={`https://bit.ly/dan-abramov?index=${index}`} />
                    <Text>{contact.username}</Text>
                  </HStack>
                </ListItem>
              ))
            ) : (
              <Text>No contacts found</Text>
            )}
          </List>
        </Box>
      </Flex>

     <PrivateChat destinatario={{
      username: "eze",
      userid: "2333"
     }} enviador={{
        username: 'morgana',
        userid: '223'
      }} />

    </Flex>
  );
};

export default Chat;
