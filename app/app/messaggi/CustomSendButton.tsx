import { IconSend2 } from "@tabler/icons-react";
import {
  DefaultStreamChatGenerics,
  useTranslationContext,
} from "stream-chat-react";
import type { Message } from "stream-chat";
import {
  ActionIcon,
  ActionIconProps,
  Box,
  Button,
  ButtonProps,
  MantineProvider,
  Tooltip,
  UnstyledButton,
  UnstyledButtonProps,
  VariantColorsResolver,
  defaultVariantColorsResolver,
} from "@mantine/core";

type SendButtonProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = {
  sendMessage: (
    event: React.BaseSyntheticEvent,
    customMessageData?: Partial<Message<StreamChatGenerics>>
  ) => void;
} & Partial<ActionIconProps>;

export const CustomSendButton = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>({
  sendMessage,
  ...rest
}: SendButtonProps<StreamChatGenerics>) => {
  const { t } = useTranslationContext("SendButton");

  return (
    <MantineProvider
      theme={{ variantColorResolver: defaultVariantColorsResolver }}
    >
      <Tooltip label={t<string>("Send")}>
        <ActionIcon
          variant="filled"
          color="var(--str-chat__primary-color)"
          size="lg"
          ml="sm"
          radius="xl"
          aria-label={t("aria/Send")}
          data-testid="send-button"
          onClick={sendMessage}
          {...rest}
        >
          <IconSend2
            style={{
              width: "70%",
              height: "70%",
              marginLeft: "2px",
              marginTop: "1px",
            }}
          />
        </ActionIcon>
      </Tooltip>
    </MantineProvider>
  );
};
