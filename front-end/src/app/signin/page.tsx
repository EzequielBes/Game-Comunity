"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Text, Button, Input, VStack, Heading } from "@chakra-ui/react";
import { signinUser } from "../../gateway/users";
import { useAuth } from "../../contexts/AuthContext";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await signinUser(formData.email, formData.password);
      
      if (response.output && response.output.token) {
        login(response.output.token);
        // O redirecionamento será feito pelo AuthContext
      } else {
        setError("Resposta inválida do servidor");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        p={8}
        maxW="md"
        w="full"
        bg="white"
        rounded="lg"
        shadow="lg"
      >
        <VStack spacing={6}>
          <Heading size="lg">Login</Heading>

          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />

              <Input
                name="password"
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />

              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
}
