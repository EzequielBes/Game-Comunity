"use client"

import { InputComp } from "@/components/inputcomponent";
import { signupUser } from "@/gateway/users";
import { Box, Flex } from "@chakra-ui/layout";
import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import sign from "../../signup.png";

interface FormData {
  "full-name": string;
  username: string;
  email: string;
  password: string;
  "confirm-password": string;
}

export default function SignupForm() {
  const { control, handleSubmit } = useForm<FormData>();
  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = async (data: FormData) => {
    console.log("Form Data Submitted:", data); // Log dos dados no console
    const log = await signupUser(data["full-name"], data.username, data.email, data.password)
    setFormData(data); // Atualiza o estado com os dados do formulário
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} height="100vh" bg={"#1A213C"}>
      <Flex
        flex={1}
        height={{ base: "50%", md: "100%" }}
        align="center"
        justify="center"
        overflow="hidden"
        bg={"#0F172A"} // Fundo mais escuro para a imagem
      >
        <Image src={sign} alt="Sign Up" layout="fill" objectFit="cover" />
      </Flex>
      <Flex
        flex={1}
        direction="column"
        align="center"
        justify="center"
        p={{ base: 4, md: 6 }}
        height={{ base: "50%", md: "100%" }}
        bg={"#1A213C"} // Fundo do formulário
      >
        <Box maxW="lg" width="100%">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={4} textAlign="center">
              <FormLabel htmlFor="full-name">Full Name</FormLabel>
              <Controller
                name="full-name"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputComp
                    id="full-name"
                    {...field}
                    place="Enter your full name"
                  />
                )}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputComp
                    id="username"
                    {...field}
                    place="Enter your username"
                  />
                )}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputComp id="email" {...field} place="Enter your email" />
                )}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputComp
                    id="password"
                    {...field}
                    place="Enter your password"
                  />
                )}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
              <Controller
                name="confirm-password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputComp
                    id="confirm-password"
                    {...field}
                    place="Confirm your password"
                  />
                )}
              />
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">
              Sign Up
            </Button>
          </form>

          {formData && (
            <Box mt={6} p={4} bg={"#2A2F44"} borderRadius={"md"}>
              <pre>{JSON.stringify(formData, null, 2)}</pre>
            </Box>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
