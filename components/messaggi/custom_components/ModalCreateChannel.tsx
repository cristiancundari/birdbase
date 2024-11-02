"use client";

import { useSupabase } from "@/providers/SupabaseProvider";
import {
  Combobox,
  ComboboxData,
  ComboboxItem,
  Group,
  Modal,
  Pill,
  PillsInput,
  TextInput,
  useCombobox,
} from "@mantine/core";
import debounce from "lodash.debounce";
import { SetStateAction, useCallback, useState } from "react";
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
  const [results, setResults] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [value, setValue] = useState<ComboboxItem[]>([]);
  const [searchStr, setSearchStr] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) => {
    setValue((current) => {
      if (current.some((c) => c.value == val)) {
        return current.filter((v) => v.value !== val);
      } else {
        const found = results.find((r) => r.id == val);
        if (!found) return current;
        const newEl: ComboboxItem = {
          label: found.name || "Sconosciuto",
          value: found.id,
        };
        return [...current, newEl];
      }
    });
    setSearchStr("");
  };

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v.value !== val));

  const debouncedCustomFetchResults = useCallback(
    debounce(async (value: SetStateAction<string>) => {
      if (!client) return;

      const filters: UserFilters<DefaultGenerics> = {
        $and: [
          { name: { $autocomplete: value as string } },
          { id: { $ne: supabase.user!.id } },
        ],
      };

      if (value) {
        const channels = await client.queryUsers(filters, undefined, {
          limit: 5,
        });
        setResults(channels.users);
      } else {
        setResults([]);
      }
      setSearching(false);
    }, 300),
    [client]
  );

  const options = results
    .filter((u) => !value.some((v) => v.value == u.id))
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

  return (
    <Modal opened={opened} onClose={onClose} title="Crea un canale">
      <TextInput label="Nome del canale"></TextInput>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <Combobox.DropdownTarget>
          <PillsInput onClick={() => combobox.openDropdown()} label="Utenti">
            <Pill.Group>
              {value.map((item) => (
                <Pill
                  key={item.value}
                  withRemoveButton
                  onRemove={() => handleValueRemove(item.value)}
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
                    combobox.updateSelectedOptionIndex();
                    setSearchStr(event.currentTarget.value);
                    debouncedCustomFetchResults(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && searchStr.length === 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1].value);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown className="str-chat">
          <Combobox.Options>
            {options.length > 0 ? (
              options
            ) : (
              <Combobox.Empty>Nothing found...</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Modal>
  );
}

export default ModalCreateChannel;
