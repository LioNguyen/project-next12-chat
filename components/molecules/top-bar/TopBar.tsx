import { Flex, Heading, Avatar } from "@chakra-ui/react";

interface TopBarProps {
  email: string;
}

export function TopBar({ email }: TopBarProps) {
  return (
    <Flex bg="gray.100" h="81px" w="100%" align="center" p={5}>
      <Avatar src="" marginEnd={3} />
      <Heading size="lg">{email}</Heading>
    </Flex>
  );
}
