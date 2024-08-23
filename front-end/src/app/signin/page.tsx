"use client";
import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/button";
import { FormControl } from "@chakra-ui/form-control";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { useForm, Controller } from "react-hook-form";
import { InputComp } from "@/components/inputcomponent";
import { signinUser } from "@/api/users";
import { decodeJwtToken } from "@/jwt/decode";

// Animação de abertura de tela
const openingAnimation = keyframes`
  0% { transform: scale(1); opacity: 0; }
  50% { transform: scale(1.1); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
`;

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Duração do efeito de abertura
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: FormData) => {
    const signin = await signinUser(data.email, data.password)
    if(signin.output.erro) return setErrorMessage(signin.output.erro);
    const decoded:any = decodeJwtToken(signin.output)
    localStorage.setItem("account_id", decoded['account_id'])
    localStorage.setItem("email", decoded['username'])

    router.push("/chat/private")
  };

  return (
    <Flex
      h={"100vh"}
      w={`100vw`}
      bg={"#1B202B"}
      justify={`center`}
      align={`center`}
      overflow={`hidden`}
      animation={loading ? `${openingAnimation} 1.5s ease-out` : 'none'}
    >
      <Flex
        flexDir={`column`}
        p={8}
        borderRadius={`md`}
        opacity={loading ? 0 : 1}
        transition={`opacity 0.5s`}
        color={`white`}
        w={{ base: "90%", sm: "80%", md: "60%", lg: "40%" }}
      >
        <Box textAlign={`center`} mb={4} fontSize={{ base: "xl", md: "2xl" }}>
          Game Community
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box gap={`4`} display={`flex`} flexDir={`column`} color={`white`}>
            <FormControl mb={4}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputComp type="text" place="Email" {...field} />
                )}
              />
            </FormControl>
            <FormControl mb={4}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <InputComp type="password" place="Password" {...field} />
                )}
              />
            </FormControl>
            {errorMessage &&
            <Text color={'red.400'}>{errorMessage}</Text>
            }
            <Button
              type="submit"
              bg={"blue.500"}
              color={"white"}
              transition={"filter 0.3s"}
              _hover={{ filter: 'brightness(1.2)' }}
              boxShadow={'1px 4px 12px -2px rgba(66, 68, 90, 0.8)'}
            >
              Entrar
            </Button>
          </Box>
        </form>
      </Flex>
    </Flex>
  );
}
