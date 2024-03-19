import {
  formatDataOra,
  getBucketImgPath,
  showNotification,
} from "@/lib/helper";
import {
  Modal,
  Tabs,
  Image,
  ScrollAreaAutosize,
  ScrollArea,
  SimpleGrid,
  Group,
  Text,
  Stack,
  Button,
  Textarea,
  Badge,
} from "@mantine/core";
import { saveAs } from "file-saver";
import { useSetState } from "@mantine/hooks";
import { RichiestaRegistrazione } from "@prisma/client";
import {
  IconCertificate,
  IconCheck,
  IconDownload,
  IconId,
  IconX,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiFetch";
import { error } from "console";

interface RegistrazioneAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (result: "approved" | "rejected") => void;
  richiestaRegistrazione: RichiestaRegistrazione | null;
}

function RegistrazioneAdminModal({
  isOpen,
  onClose,
  onResult,
  richiestaRegistrazione,
}: RegistrazioneAdminModalProps) {
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [spiegazione, setSpiegazione] = useState("");
  const [fullScreenModal, setFullScreenModal] = useSetState({
    isOpen: false,
    img: "",
    title: "",
  });

  if (richiestaRegistrazione === null) {
    return null;
  }

  async function approva() {
    setApproveLoading(true);
    const res = await apiFetch.post(
      `/admin/api/registrazioni/${richiestaRegistrazione!.id}`,
      {
        status: "approved",
        spiegazione,
      }
    );
    if (res.error) {
      showNotification({ message: res.message });
      setApproveLoading(false);
      onClose();
      return;
    }
    showNotification({
      message: "La richiesta è stata approvata correttamente",
      success: true,
    });
    setApproveLoading(false);
    onClose();
    onResult("approved");
  }

  async function rifiuta() {
    setRejectLoading(true);
    const res = await apiFetch.post(
      `/admin/api/registrazioni/${richiestaRegistrazione!.id}`,
      {
        status: "rejected",
        spiegazione,
      }
    );
    if (res.error) {
      showNotification({ message: res.message });
      setRejectLoading(false);
      onClose();
      return;
    }
    showNotification({
      message: "La richiesta è stata rifiutata correttamente",
      success: true,
    });
    setRejectLoading(false);
    onClose();
    onResult("rejected");
  }

  return (
    <>
      <Modal
        opened={isOpen}
        onClose={onClose}
        size="auto"
        title="Documenti inviati"
      >
        <SimpleGrid cols={2} style={{ alignItems: "end" }}>
          <Group mah={400} h="100%" justify="center">
            <Image
              src={getBucketImgPath(
                "documents",
                richiestaRegistrazione.docIdentita
              )}
              h="100%"
              alt="Doc. Identità"
              fit="scale-down"
              style={{ objectPosition: "bottom center", cursor: "zoom-in" }}
              onClick={() =>
                setFullScreenModal({
                  isOpen: true,
                  img: richiestaRegistrazione.docIdentita,
                  title: "Documento d'identità",
                })
              }
            />
          </Group>
          <Group mah={400} h="100%" justify="center">
            <Image
              src={getBucketImgPath("documents", richiestaRegistrazione.docFoi)}
              h="100%"
              alt="Doc. FOI"
              fit="scale-down"
              style={{ objectPosition: "bottom center", cursor: "zoom-in" }}
              onClick={() =>
                setFullScreenModal({
                  isOpen: true,
                  img: richiestaRegistrazione.docFoi,
                  title: "Documento FOI",
                })
              }
            />
          </Group>
          <Text c="dimmed" ta="center" size="sm">
            {"Documento d'identità"}
          </Text>
          <Text c="dimmed" ta="center" size="sm">
            {"Documento FOI"}
          </Text>
        </SimpleGrid>
        {richiestaRegistrazione.approvatoIl ? (
          <Group justify="end" mt="xl">
            <Stack gap={0}>
              <Badge color="teal" leftSection={<IconCheck size={14} />}>
                Approvato
              </Badge>
              <Text c="dimmed" size="sm">
                {formatDataOra(richiestaRegistrazione.approvatoIl)}
              </Text>
            </Stack>
          </Group>
        ) : richiestaRegistrazione.rifiutatoIl ? (
          <Group justify="end" mt="xl">
            <Stack gap={0}>
              <Badge color="red" leftSection={<IconX size={14} />}>
                Rifiutato
              </Badge>
              <Text c="dimmed" size="sm">
                {formatDataOra(richiestaRegistrazione.rifiutatoIl)}
              </Text>
            </Stack>
          </Group>
        ) : (
          <>
            <Stack>
              <Textarea
                label="Descrizione"
                placeholder="Spiega la tua scelta"
                value={spiegazione}
                onChange={(e) => setSpiegazione(e.currentTarget.value)}
              ></Textarea>
              <Group justify="end">
                <Button
                  color="red"
                  leftSection={<IconX size={14} />}
                  onClick={rifiuta}
                  loading={rejectLoading}
                >
                  Rifiuta
                </Button>
                <Button
                  color="teal"
                  leftSection={<IconCheck size={14} onClick={approva} />}
                  onClick={approva}
                  loading={approveLoading}
                >
                  Approva
                </Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>

      <Modal
        opened={fullScreenModal.isOpen}
        onClose={() => setFullScreenModal({ isOpen: false })}
        size="auto"
        title={fullScreenModal.title}
        styles={{ body: { height: "100%" } }}
        scrollAreaComponent={ScrollAreaAutosize}
      >
        <Stack align="center">
          <Button
            variant="light"
            leftSection={<IconDownload size={14} />}
            onClick={() => {
              const hasExt = fullScreenModal.img.includes(".");
              const ext = hasExt ? fullScreenModal.img.split(".").pop() : "jpg";
              saveAs(
                getBucketImgPath("documents", fullScreenModal.img),
                `${richiestaRegistrazione.nome} ${richiestaRegistrazione.cognome} - ${richiestaRegistrazione.rna} - ${fullScreenModal.title}.${ext}`
              );
            }}
          >
            Download
          </Button>
          <Image
            src={getBucketImgPath("documents", fullScreenModal.img)}
            alt={fullScreenModal.title}
            fit="contain"
            w="auto"
          />
        </Stack>
      </Modal>
    </>
  );
}

export default RegistrazioneAdminModal;
