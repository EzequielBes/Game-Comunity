"use client"
import { PrivateChat } from '@/components/chatcomponent';
import { ContactComponent } from '@/components/contantscomponent';
import socket from '@/domain/socket';
import { addfriends, getAllfriends, getPendentRequest } from '@/gateway/friends';
import {
    Flex
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [newContact, setNewContact] = useState<string>('');
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const storedAccountId = localStorage.getItem('username');
    setAccountId(storedAccountId);
  }, []);

  useEffect(() => {
    if (accountId) {
      socket.emit('registerAccountId', accountId);
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
  const [selectedContact, setSelectedContact] = useState<{ friend: string; me: string } | null>(null);

  const handleContactClick = (contact: { friend: string; me: string }) => {
    setSelectedContact(contact);
    console.log("Contato selecionado:", contact);
    // Aqui você pode fazer outras ações com os dados do contato
  };

  return (
    <Flex direction="row" h="100vh" p={4} bg="gray.800">
      <Flex flex={1}>
      <ContactComponent onContactClick={handleContactClick}/>
      </Flex>
      <Flex flex={2}>
      <PrivateChat destinatario={{
          friend: selectedContact?.friend,
      }} enviador={{
         sender: accountId,
      }} />

      </Flex>



    </Flex>
  );
};

export default Chat;
