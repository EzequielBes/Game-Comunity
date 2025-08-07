import { Input } from "@chakra-ui/react";

interface InputProps {
  type: string;
  place: string;
  [key: string]: any;
}

export const InputComp = ({ type, place, ...props }: InputProps) => {
  return <Input type={type} placeholder={place} {...props} />;
};
