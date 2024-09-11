"use client";
import { InputComp } from "@/components/inputcomponent";
import { signupUser } from "@/gateway/users";
import { Box, Flex } from "@chakra-ui/layout";
import { Button, FormControl, FormLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { neonCursor } from "threejs-toys";

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

  useEffect(() => {
    // Adiciona o efeito do cursor neon
    neonCursor({
      el: document.getElementById("app") as HTMLElement,
      shaderPoints: 16,
      curvePoints: 80,
      curveLerp: 0.5,
      radius1: 5,
      radius2: 30,
      velocityTreshold: 10,
      sleepRadiusX: 100,
      sleepRadiusY: 100,
      sleepTimeCoefX: 0.0025,
      sleepTimeCoefY: 0.0025
    });
  }, []);

  const onSubmit = async (data: FormData) => {
    console.log("Form Data Submitted:", data);
    const log = await signupUser(
      data["full-name"],
      data.username,
      data.email,
      data.password
    );
    setFormData(data);
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} height="100vh" bg={"#1A213C"} id="app">
      <Flex
        flex={1}
        height={{ base: "50%", md: "100%" }}
        align="center"
        justify="center"
        overflow="hidden"
        bg={"#0F172A"}
      >
        <Flex
          zIndex="9999"
          flex={1}
          direction="column"
          align="center"
          justify="center"
          p={{ base: 4, md: 6 }}
          height={{ base: "50%", md: "100%" }}
          position="absolute"
          w="100vw"
          ml="100%"
          background="rgba(000, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.5)"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <Box maxW="lg" width="100%" color={`white`}>
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



                        <Button type="submit" colorScheme="teal" width="full">
                          Sign Up
                        </Button>
                      </form>


          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
