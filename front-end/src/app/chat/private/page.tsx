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
import { ContactComponent } from '@/components/contantscomponent';

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
  const [selectedContact, setSelectedContact] = useState<{ username: string; userid: string } | null>(null);

  const handleContactClick = (contact: { username: string; userid: string }) => {
    setSelectedContact(contact);
    console.log("Contato selecionado:", contact);
    // Aqui você pode fazer outras ações com os dados do contato
  };

  return (
    <Flex direction="row" h="100vh" p={4} bg="gray.100">
      <Flex flex={1}>
      <ContactComponent onContactClick={handleContactClick}/>
      </Flex>
      <Flex flex={2}>
      <PrivateChat destinatario={{
        username: selectedContact?.username,
        userid: selectedContact?.userid
      }} enviador={{
          username: 'Ezequiel',
          userid: '223'
      }} />

      </Flex>



    </Flex>
  );
};

export default Chat;
