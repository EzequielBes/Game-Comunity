"use client";

import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Flex, Text, Button, VStack, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirecionar usuários autenticados para o marketplace
      router.push('/marketplace');
    }
  }, [isAuthenticated, user, router]);

  // Se o usuário está autenticado, mostrar loading enquanto redireciona
  if (isAuthenticated && user) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.50">
        <Text>Redirecionando...</Text>
      </Flex>
    );
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="linear-gradient(to bottom, hsl(var(--cozy-background)), hsl(var(--cozy-background) / 0.9)), url(/signup.png)"
      bgSize="cover"
      bgPosition="center"
      className="font-cozy"
    >
      <Box
        p={8}
        maxW="lg"
        w="full"
        bg="hsl(var(--cozy-card) / 0.8)"
        rounded="2xl"
        shadow="2xl"
        textAlign="center"
        border="1px"
        borderColor="hsl(var(--cozy-border))"
        backdropFilter="blur(10px)"
      >
        <VStack spacing={6}>
          <Heading size="2xl" color="hsl(var(--cozy-title))" textShadow="0 0 10px hsl(var(--cozy-highlight) / 0.5)">
            Bem-vindo à Game Community
          </Heading>
          <Text color="hsl(var(--cozy-text-secondary))">
            Sua plataforma para conectar-se com outros jogadores, negociar itens e fazer parte de uma comunidade incrível.
          </Text>
          <Flex>
            <Link href="/signin" passHref>
              <Button
                bg="hsl(var(--cozy-primary))"
                color="hsl(var(--cozy-text))"
                _hover={{ bg: "hsl(var(--cozy-highlight))", color: "hsl(var(--cozy-card))" }}
                mr={4}
                size="lg"
                shadow="lg"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup" passHref>
              <Button
                bg="hsl(var(--cozy-secondary))"
                color="hsl(var(--cozy-text))"
                _hover={{ bg: "hsl(var(--cozy-highlight))", color: "hsl(var(--cozy-card))" }}
                size="lg"
                shadow="lg"
              >
                Cadastro
              </Button>
            </Link>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}
