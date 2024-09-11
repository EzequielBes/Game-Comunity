import { Input } from "@chakra-ui/input";
import { InputProps } from "@chakra-ui/react";

export const InputComp = ({ type, place, ...props }: InputProps) => {
  return (
    <Input
      type={type}
      placeholder={place}
      bg={"rgba(000, 000, 000, 0.4)"}
      boxShadow={"1px 1px 11px -3px rgba(19, 19, 22, 0.8)"}
      border={"none"}
      _focus={{
        border: "none",
        outline: 0,
        borderColor: "transparent",
      }}
      color={"white"}
      {...props}
    />
  );
};
