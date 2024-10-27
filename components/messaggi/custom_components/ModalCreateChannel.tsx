"use client";

import ModalConferma from "@/components/ModalConferma";
import { showNotification } from "@/lib/helper";
import { useModalInit } from "@/lib/hooks";
import { useSupabase } from "@/providers/SupabaseProvider";
import {
  Combobox,
  ComboboxItem,
  Group,
  Loader,
  Pill,
  PillsInput,
  TextInput,
  useCombobox,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { ca } from "date-fns/locale";
import debounce from "lodash.debounce";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import {
  DefaultGenerics,
  StreamChat,
  UserFilters,
  UserResponse,
} from "stream-chat";
import { Avatar, DefaultStreamChatGenerics } from "stream-chat-react";

interface ModalCreateChannelProps {
  onClose: () => void;
  opened: boolean;
  client: StreamChat;
}
function ModalCreateChannel({
  opened,
  onClose,
  client,
}: ModalCreateChannelProps) {
  const supabase = useSupabase();
  const [userSearchResults, setUserSearchResults] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });
  const form = useForm({
    initialValues: {
      channelName: "",
      users: [] as ComboboxItem[],
    },
    validate: {
      channelName: (value) => {
        if (!value) return "Il nome del canale è obbligatorio";
        return value.length > 0 && value.length < 100
          ? null
          : "Il nome del canale deve essere lungo tra 1 e 100 caratteri";
      },
      users: (value) =>
        value.length > 0 ? null : "Devi selezionare almeno un utente",
    },
  });

  useEffect(() => {
    if (opened) form.reset();
  }, [opened]);

  const onComboboxOptionSelected = (selectedId: string) => {
    form.setFieldValue("users", (current) => {
      if (current.some((c) => c.value == selectedId)) {
        // Se seleziono un utente già presente, lo rimuovo dalla lista
        return current.filter((v) => v.value !== selectedId);
      } else {
        const found = userSearchResults.find((r) => r.id == selectedId);
        if (!found) return current;
        const newItem: ComboboxItem = {
          label: found.name || "Sconosciuto",
          value: found.id,
        };
        return [...current, newItem];
      }
    });
    setSearchStr("");
    setUserSearchResults([]);
  };

  const onComboboxOptionRemoved = (selectedId: string) =>
    form.setFieldValue("users", (current) =>
      current.filter((v) => v.value !== selectedId)
    );

  const debouncedFetchResults = useCallback(
    debounce(async (searchTerm: SetStateAction<string>) => {
      if (!client) return;

      //strip whitespaces from searchTerm variable
      searchTerm = (searchTerm as string).trim();

      const filters: UserFilters<DefaultGenerics> = {
        $and: [
          { name: { $autocomplete: searchTerm as string } },
          { id: { $ne: supabase.user!.id } },
        ],
      };

      if (searchTerm.length > 0) {
        client
          .queryUsers(filters, undefined, {
            limit: 5,
          })
          .then((channels) => {
            setUserSearchResults(channels.users);
          })
          .catch(() => {
            setUserSearchResults([]);
          });
      } else {
        setUserSearchResults([]);
      }
      setSearching(false);
    }, 300),
    [client]
  );

  const createChannel = async () => {
    form.validate();
    if (form.isValid()) {
      const channel = client.channel("messaging", {
        name: form.values.channelName,
        members: [supabase.user!.id, ...users.map((u) => u.value)],
      });

      channel
        .create()
        .then(() => {
          onClose();
          showNotification({
            message: "Canale creato con successo",
            success: true,
          });
        })
        .catch(() => {
          showNotification({ message: "Errore nella creazione del canale" });
        });
    }
  };

  const options = userSearchResults
    .filter((u) => !form.values.users.some((v) => v.value == u.id))
    .map((user) => (
      <Combobox.Option value={user.id} key={user.id}>
        <Group className="messaging-create-channel__user-result">
          <Avatar
            image={user.image}
            name={user.name}
            shape="rounded"
            size={40}
          />
          {user.online && (
            <div className="messaging-create-channel__user-result-online" />
          )}
          <div className="messaging-create-channel__user-result__details">
            <span>{user.name}</span>
          </div>
        </Group>
      </Combobox.Option>
    ));

  const users = form.values.users;

  return (
    <ModalConferma
      isOpen={opened}
      onClose={onClose}
      closeOnSubmit={false}
      onConfirm={createChannel}
      confirmButton={{ label: "Crea", icon: <IconPlus size={14} /> }}
      titolo="Crea un canale"
    >
      <TextInput
        label="Nome del canale"
        {...form.getInputProps("channelName")}
      ></TextInput>
      <Combobox store={combobox} onOptionSubmit={onComboboxOptionSelected}>
        <Combobox.DropdownTarget>
          <PillsInput
            onClick={() => combobox.openDropdown()}
            label="Utenti"
            error={form.getInputProps("users").error}
          >
            <Pill.Group>
              {users.map((item) => (
                <Pill
                  key={item.value}
                  withRemoveButton
                  onRemove={() => onComboboxOptionRemoved(item.value)}
                >
                  {item.label}
                </Pill>
              ))}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={searchStr}
                  placeholder="Search values"
                  onChange={(event) => {
                    setSearching(true);
                    combobox.updateSelectedOptionIndex();
                    setSearchStr(event.currentTarget.value);
                    debouncedFetchResults(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && searchStr.length === 0) {
                      event.preventDefault();
                      onComboboxOptionRemoved(users[users.length - 1].value);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        {searchStr && (
          <Combobox.Dropdown className="str-chat">
            <Combobox.Options>
              {searching ? (
                <Combobox.Empty>
                  <Loader size={18} />
                </Combobox.Empty>
              ) : options.length > 0 ? (
                options
              ) : (
                <Combobox.Empty>Nothing found...</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        )}
      </Combobox>
    </ModalConferma>
  );
}

export default ModalCreateChannel;
