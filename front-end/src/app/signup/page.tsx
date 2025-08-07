"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Flex, Text, Button, Input, VStack, Heading } from "@chakra-ui/react";
import { signupUser } from "../../gateway/users";

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      await signupUser(
        formData.fullName,
        formData.username,
        formData.email,
        formData.password
      );
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta");
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
          <Heading size="lg">Criar Conta</Heading>

          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <VStack spacing={4}>
              <Input
                name="fullName"
                type="text"
                placeholder="Nome completo"
                value={formData.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
              />

              <Input
                name="username"
                type="text"
                placeholder="Nome de usuário"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />

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
                autoComplete="new-password"
              />

              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
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
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
}
