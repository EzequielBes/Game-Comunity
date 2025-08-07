'use client';

import { Box, Text, Button } from '@chakra-ui/react';

export default function TestPage() {
  return (
    <Box p={8}>
      <Text fontSize="2xl" mb={4}>Teste do Chakra UI</Text>
      <Button colorScheme="blue">Botão de Teste</Button>
    </Box>
  );
} 